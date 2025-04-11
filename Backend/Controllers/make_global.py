import gdstk
import math

def create_blockage(x1,x2,h,blockage_props,direction):
	avail_space = x2-x1
	blockage_space = blockage_props['min_width'] + 2*blockage_props['spacing']
	if blockage_space <= avail_space:
		if direction == 'H':
			return gdstk.rectangle((0,x1+blockage_props['spacing']),(h,x2-blockage_props['spacing']),
							layer = blockage_props['layer'][0], 
							datatype = blockage_props['layer'][1])

		return gdstk.rectangle((x1+blockage_props['spacing'],0),(x2-blockage_props['spacing'],h),
							layer = blockage_props['layer'][0], 
							datatype = blockage_props['layer'][1])
							
							
#-----------------------------------------------------------------------
def create_label(pin,offset,lbl_props,direction):
	if direction == 'H':
		return gdstk.Label(pin, 
						(lbl_props['enclosure'], offset+lbl_props['enclosure']),
						'sw',
						lbl_props['angle'],
						magnification = lbl_props['size'],
						layer = lbl_props['layer'][0],
						texttype = lbl_props['layer'][1])
	
	return  gdstk.Label(pin, 
					(offset+lbl_props['enclosure'], lbl_props['enclosure']),
					'sw',
					lbl_props['angle'],
					magnification = lbl_props['size'],
					layer = lbl_props['layer'][0],
					texttype = lbl_props['layer'][1])


#-----------------------------------------------------------------------
def create_pin(global_pin_info,repetition,cell,w,h,offset,metal_layer,lbl_props,blockage_props,limit_to_size,direction='V'):
	flag = 0
	for pin,props in global_pin_info.items():
		if flag == 1:
			break
			
		if repetition[pin] > 0:
			for x in range(min(props['clubbing'],repetition[pin])):
				if limit_to_size and (offset + props['width']) > w:
					flag = 1
					break
					
				if direction == 'V':
					cell.add(gdstk.rectangle((offset,0),(offset+props['width'],h),layer = metal_layer[0], datatype = metal_layer[1]))
				elif direction == 'H':
					cell.add(gdstk.rectangle((0,offset),(h,offset+props['width']),layer = metal_layer[0], datatype = metal_layer[1]))
				
				cell.add(create_label(pin,offset,lbl_props,direction))
				repetition[pin]-=1
				
				if x < min(props['clubbing'],repetition[pin])-1:
					prev_xpoint = offset + props['width']
					offset = offset + props['self_spacing'] + props['width']
					if (not limit_to_size) and offset > w:
						flag = 1
						break
					new_blockage = create_blockage(prev_xpoint,offset,h,blockage_props,direction)
					if new_blockage != None:
						cell.add(new_blockage)
			
			
			if any(value > 0 for value in repetition.values()) and flag == 0:
				prev_xpoint = offset + props['width']	
				remaining_pins = [name for name,cnt in repetition.items() if cnt > 0]
				if len(remaining_pins) == 1 and pin == remaining_pins[0]:
					offset = offset + props ['self_spacing'] + props['width']
				else:
					offset = offset + props ['other_spacing'] + props['width']
				if (not limit_to_size) and offset > w:
					flag = 1
					break
				new_blockage = create_blockage(prev_xpoint,offset,h,blockage_props,direction)
				if new_blockage != None:
					cell.add(new_blockage)
			
					
	if any(value > 0 for value in repetition.values()) and flag == 0:
		create_pin(global_pin_info,repetition,cell,w,h,offset,metal_layer,lbl_props,blockage_props,limit_to_size,direction)


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
def make_global(cell,w,h,configuration,direction,pin_name,limit_to_size):
	## Fetching info from config_file
	metal_layer = configuration['layer_inputs']['power_metal']['layer_number']
	
	lbl_props = {
		'layer' : configuration['layer_inputs']['power_metal']['label_number'],
		'enclosure' : configuration['setup']['label']['enclosure'],
		'size' : configuration['setup']['label']['size'],
		'orientation' : configuration['setup']['label']['orientation'],
		'angle' : get_angle(configuration['setup']['label']['orientation'])
	}
	
	
	blockage_props = {
		'layer' : configuration['layer_inputs']['power_metal']['blockage_layer'],
		'min_width' : configuration['setup']['blockage']['min_width'],
		'spacing' : configuration['setup']['blockage']['spacing_to_pin']
	}
	
	global_net = configuration['matrix_inputs']['global_net']
	offset = configuration['setup']['global_pin']['offset']
	
	global_pin_info = {}
	repetition = {}
	for pin in configuration['global_pin_info']:
		if pin['name'] in pin_name:
			global_pin_info[pin['name']] = {}
			global_pin_info[pin['name']]['width'] = pin['width']
			global_pin_info[pin['name']]['self_spacing'] = pin['spacing']['self']
			global_pin_info[pin['name']]['other_spacing'] = pin['spacing']['other']
			global_pin_info[pin['name']]['clubbing'] = pin['clubbing']
			repetition[pin['name']] = pin['repetition']
	
		
	if direction == 'vertical':
		create_pin(global_pin_info,repetition,cell,w,h,offset,metal_layer,lbl_props,blockage_props,limit_to_size)
				
	elif direction == 'horizontal':
		create_pin(global_pin_info,repetition,cell,w,h,offset,metal_layer,lbl_props,blockage_props,limit_to_size,direction='H')
	else:
		print('Error: Unknown direction')
