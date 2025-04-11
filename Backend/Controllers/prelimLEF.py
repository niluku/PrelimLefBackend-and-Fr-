import gdstk
import json
import Controllers.make_global as gp
import Controllers.make_local as lp
import os

def create_gds(lib):
    output_path = './new.gds'
    lib.write_gds(output_path)
    print(f"GDS file created at: {output_path}")  # Debugging line

#-----------------------------------------------------------------------
def fetch_local_pin_info(configuration):
	local_pins = {}
	for des in configuration["local_pin_info"]:
		local_pins[des["cell_name"]] = [des["signal_name"], des["repetition"]]
	return local_pins
	

#-----------------------------------------------------------------------	
def read_json(config_file):
	try:
		with open(config_file,'r') as cf:
			configuration = json.load(cf)
			return configuration
			print(configuration)
			
	except json.JSONDecodeError as e:
		print(f'Error decoding JSON: {e}')
		
	except Exception as e:
		print(f'An unexpected error occurred: {e}')
		

#-----------------------------------------------------------------------	
def prelimLEF(configuration):
	## Read JSON
	# configuration = read_json(config_file)
	## Reading the configuration and implementing the GDS
	direction = configuration['setup']['global_pin']['direction']
	limit_to_size = configuration['setup']['limit_to_size']
	local_pins = fetch_local_pin_info(configuration)
	
	lib = gdstk.Library(unit=configuration['setup']['unit'], precision=configuration['setup']['precision'])
	top_cell = gdstk.Cell(configuration['matrix_inputs']['top_cell'])
	lib.add(top_cell)
	
	b_layer = configuration['layer_inputs']['boundary_layer'][0]
	b_datatype = configuration['layer_inputs']['boundary_layer'][1]
	ref_origin = [0,0]
	
	for col,rows in enumerate(configuration['matrix_inputs']['rows']):
		h = configuration['matrix_inputs']['height'][col] 
		for r,cell in enumerate(rows):
			w = configuration['matrix_inputs']['width'][r]
			if cell != '':
				## Create a new cell
				new_cell = gdstk.Cell(cell)
				boundary = gdstk.rectangle((0,0),(w,h),layer = b_layer, datatype = b_datatype)
				new_cell.add(boundary)
				lib.add(new_cell)
				
				## Create global pins
				if direction == "vertical":
					pin_name = configuration['matrix_inputs']['global_net'][r]
					gp.make_global(new_cell,w,h,configuration,direction,pin_name,limit_to_size)
					
				elif direction == "horizontal":
					pin_name = configuration['matrix_inputs']['global_net'][col]
					gp.make_global(new_cell,h,w,configuration,direction,pin_name,limit_to_size)
				
				
				## Create local pins
				lp.make_local(new_cell,boundary,local_pins[cell],configuration,w,h,limit_to_size)
				
				## Create a ref of the created cell in the top cell
				new_ref = gdstk.Reference(new_cell, origin = ref_origin)
				top_cell.add(new_ref)
				
			ref_origin[0]+=w
		
		ref_origin[0]=0
		ref_origin[1]+=h
			
	create_gds(lib)
	
	
if __name__ == '__main__':
	# os.system("/usr/bin/python3 read_excel.py")
	prelimLEF('./config1.json')
