
						function link_slider(slider){
							
							console.log(slider);
							console.log(slider.parentElement);
							var match = slider.id.match(/\d+/);
							var div_number = parseInt(match[0], 10);
							var brother = document.getElementById("sima"+div_number);
							console.log(brother);
							console.log(div_number);
							var counter = document.getElementById("counter"+div_number);
							console.log(slider.value);
							counter.innerHTML = slider.value;									
							brother.style.width = 50 + slider.value/2 + "%";
							brother.style.opacity = 1;	
						}
						
						
						http://talkerscode.com/webtricks/add-edit-and-delete-rows-from-table-dynamically-using-javascript.php
						document.getElementById("save_button0").style.display="none";
						
						function edit_row(no){	
						console.log("edit_button"+no);
						console.log(document.getElementById("edit_button"+no));								
						document.getElementById("edit_button"+no).style.display="none";
						document.getElementById("save_button"+no).style.display="inline-block";
							var name=document.getElementById("title"+no);																			
							var name_data=name.innerHTML;																			
							name.innerHTML="<input type='text' id='name_text"+no+"' value='"+name_data+"'>";
							}

					function save_row(no){
						var name_val=document.getElementById("name_text"+no).value;								
						document.getElementById("title"+no).innerHTML=name_val;
						document.getElementById("edit_button"+no).style.display="inline-block";
						document.getElementById("save_button"+no).style.display="none";
							}

					function add_criterion(){
						// var new_name=document.getElementById("new_name").value;
						// console.log(n_sliders);
						var max_div = document.getElementById("progressBar1");
						var truc = max_div.querySelectorAll("div.skills-item");
						console.log(truc);
						var new_numero = truc.length+1;
						console.log(new_numero);	
						var table=document.getElementById("progressBar1");
						var html = 		'<div class="skills-item-info id="sii'+new_numero+'">'+
											'<span class="skills-item-title" id="title'+new_numero+'">Yellow Progress</span>'+
											'<button type="button" id="edit_button'+new_numero+'" value="Edit" class="editbutton" onclick="edit_row('+new_numero+')" >Edit</button>'+
											'<button type="button" id="save_button'+new_numero+'" value="Save" class="sauvegardebutton" onclick="save_row('+new_numero+')" >Save</button>'+
												'<span class="skills-item-count" id="sic'+new_numero+'">'+
													'<span class="count-animate" data-speed="1000" data-refresh-interval="50" data-to="62" data-from="0" id="countanimate'+new_numero+'"></span>'+
													'<span class="skillunits" id="counter'+new_numero+'" >	'+								
													'</span>'+
												'</span>'+
										'</div>'+
										'<div class="skills-item-meter" id="simGlobal'+new_numero+'">'+
												'<span class="skills-item-meter-active bg-blue" style="width: 50%; opacity: 1;" id="simaGlobal'+new_numero+'"></span><br>'+
										'</div>'+
										'<div class="skills-item-meter" id="sim'+new_numero+'">'+
											'<span class="skills-item-meter-active bg-yellow" id="sima'+new_numero+'"></span>'+
											'<input class="truc" type="range" min="-100" max="100" id="slider'+new_numero+'" oninput="link_slider(slider'+new_numero+')">'+
										'</div>';
									
						var new_element = document.createElement("div");
						new_element.setAttribute('class', "skills-item");
						new_element.setAttribute('id', 'si'+new_numero+'');
						new_element.innerHTML = html;
						console.log(new_element);
						table.appendChild(new_element);
						document.getElementById("save_button"+new_numero).style.display="none";

						}