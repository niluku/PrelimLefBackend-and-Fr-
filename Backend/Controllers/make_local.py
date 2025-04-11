import gdstk
import math

def create_blockage(cell,boundary,pin_with_enclosure,props,direction):
	new_blockage = gdstk.boolean(boundary,pin_with_enclosure,"not",layer=props["layer"][0], datatype=props["layer"][1])
	for poly in new_blockage:
		if direction == "T" or direction == "B":
			x = list(set([pt[0] for pt in poly.points]))
			slice_pts = gdstk.slice(poly,x,"x")
		elif direction == "L" or direction == "R":
			y = list(set([pt[1] for pt in poly.points]))
			slice_pts = gdstk.slice(poly,y,"y")
		
		for poly1 in slice_pts:
			for poly2 in poly1:
				x = [pt[0] for pt in poly2.points]
				y = [pt[1] for pt in poly2.points]
				height = max(y)-min(y)
				width = max(x)-min(x)
				if round(height,6) >= props['min_width'] and round(width,6) >= props['min_width']:
					cell.add(poly2)

	
#-----------------------------------------------------------------------					
def create_label(pin,x,y,lbl_props,lbl_lay):
	return gdstk.Label(pin, 
			(x+lbl_props['enclosure'], y+lbl_props['enclosure']),
			'sw',
			lbl_props['angle'],
			magnification = lbl_props['size'],
			layer = lbl_lay[0],
			texttype = lbl_lay[1])
					

#-----------------------------------------------------------------------					
def create_pin(pin_props,cell,boundary,w,h,local_pin_info,metal_layer_list,lbl_props,blockage_props,limit_to_size,direction='T'):

	for cnt,lay in enumerate(metal_layer_list):
		x_offset = local_pin_info["offset"][0]
		y_offset = local_pin_info["offset"][1]
		pin_with_enclosure = []
		
		for repeat in range(pin_props[1]):
			if direction == "T":
				x = x_offset
				y = h-y_offset
				new_pin = gdstk.rectangle((x,y),
								(x+local_pin_info['length'], y-local_pin_info['width']),
								layer = lay[0], 
								datatype = lay[1])
				cell.add(new_pin)
				cell.add(create_label(pin_props[0],x,y-local_pin_info['width'],lbl_props,lbl_props["layer"][cnt]))
				y_offset = y_offset+local_pin_info['width']+local_pin_info["spacing"]
				
			elif direction == "B":
				x = x_offset
				y = y_offset
				new_pin = gdstk.rectangle((x,y),
								(x+local_pin_info['length'], y+local_pin_info['width']),
								layer = lay[0], 
								datatype = lay[1])
				cell.add(new_pin)
				cell.add(create_label(pin_props[0],x,y,lbl_props,lbl_props["layer"][cnt]))
				y_offset = y+local_pin_info['width']+local_pin_info["spacing"]
				
			elif direction == "L":
				x = x_offset
				y = y_offset
				new_pin = gdstk.rectangle((x, y),
								(x+local_pin_info['width'], y+local_pin_info['length']),
								layer = lay[0], 
								datatype = lay[1])
				cell.add(new_pin)
				cell.add(create_label(pin_props[0],x,y,lbl_props,lbl_props["layer"][cnt]))
				x_offset = x+local_pin_info['width']+local_pin_info["spacing"]
				
			elif direction == "R":
				x = w-x_offset
				y = y_offset
				new_pin = gdstk.rectangle((x, y),
								(x-local_pin_info['width'], y+local_pin_info['length']),
								layer = lay[0], 
								datatype = lay[1])
				cell.add(new_pin)
				cell.add(create_label(pin_props[0],x-local_pin_info['width'],y,lbl_props,lbl_props["layer"][cnt]))
				x_offset = x_offset+local_pin_info['width']+local_pin_info["spacing"]

			pin_with_enclosure.append(gdstk.offset(new_pin,blockage_props['spacing'],layer=blockage_props['layer'][0],datatype=1000)[0])
	
	create_blockage(cell,boundary,pin_with_enclosure,blockage_props,direction)
			
			
#-----------------------------------------------------------------------
def get_angle(orient):
	if orient == 'R0':
		angle = 0
	elif orient == 'R90':
		angle = math.radians(90)
	elif orient == 'R180':
		angle = math.radians(180)
	elif orient == 'R270':
		angle = math.radians(270)
	else:
		print('Error: Wrong Orientation')
		angle = 0

	return angle

	
#-----------------------------------------------------------------------	
def make_local(cell,boundary,pin_props,configuration,w,h,limit_to_size):
	## Fetching info from config_file
	metal_layer_list = configuration['layer_inputs']['signal_metal']['layer_number']
	
	lbl_props = {
		'layer' : configuration['layer_inputs']['signal_metal']['label_number'],
		'enclosure' : configuration['setup']['label']['enclosure'],
		'size' : configuration['setup']['label']['size'],
		'orientation' : configuration['setup']['label']['orientation'],
		'angle' : get_angle(configuration['setup']['label']['orientation'])
	}
	
	
	blockage_props = {
		'layer' : configuration['layer_inputs']['signal_metal']['blockage_layer'],
		'min_width' : configuration['setup']['blockage']['min_width'],
		'spacing' : configuration['setup']['blockage']['spacing_to_pin']
	}
	
	local_pin_info = {
	"offset" : configuration['setup']['local_pin']['offset'],
	"side" : configuration['setup']['local_pin']['side'],
	"width" : configuration['setup']['local_pin']['width'],
	"length" : configuration['setup']['local_pin']['length'],
	"spacing" : configuration['setup']['local_pin']['spacing']
	}
	
		
	if local_pin_info["side"] == 'top':
		create_pin(pin_props,cell,boundary,w,h,local_pin_info,metal_layer_list,lbl_props,blockage_props,limit_to_size)
				
	elif local_pin_info["side"] == 'bottom':
		create_pin(pin_props,cell,boundary,w,h,local_pin_info,metal_layer_list,lbl_props,blockage_props,limit_to_size,direction="B")
		
	elif local_pin_info["side"] == 'left':
		create_pin(pin_props,cell,boundary,w,h,local_pin_info,metal_layer_list,lbl_props,blockage_props,limit_to_size,direction="L")
	
	elif local_pin_info["side"] == 'right':
		create_pin(pin_props,cell,boundary,w,h,local_pin_info,metal_layer_list,lbl_props,blockage_props,limit_to_size,direction="R")
	else:
		print('Error: Unknown direction')
