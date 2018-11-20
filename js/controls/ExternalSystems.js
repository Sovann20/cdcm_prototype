/*
 * Outputs the external systems' states.
 * @author Sam Guenette and Sovann Chak
 * 
 */
            let level = 100;
            let oxygenLevel = 100 
            let oClass = `<i class="fa fa-battery-full" style="color:green"></i>`;
            let batteryClass = `<i class="fa fa-battery-full" style="color:green"></i>`;

            //document.getElementById("batteryDisplay").innerHTML = level   
            function batteryTimer(){

                if(level>0)
                {   
                    batteryClass = `<i class="fa fa-battery-full" style="color:green"></i>`;

                    if(level>=85)
                    {   
                        batteryClass = `<i class="fa fa-battery-4" style="color:green"></i>`;
                    }   
                    else if(level>=70 && level <85)
                    {   
                        batteryClass = `<i class="fa fa-battery-three-quarters" style="color:green"></i>`;
                    }   
                    else if(level>=60 && level <70)
                    {   
                        batteryClass = `<i class="fa fa-battery-3" style="color:green"></i>`;
                    }   
                    else if(level>=50 && level <60)
                    {   
                        batteryClass = `<i class="fa fa-battery-half" style="color:yellow"></i>`;
                    }   
                    else if(level>=35 && level<50)
                    {   
                        batteryClass = `<i class="fa fa-battery-2" style="color:yellow"></i>`;
                    }   
                    else if(level>=15 && level<35)
                    {   
                        batteryClass = `<i class="fa fa-battery-quarter" style="color:red"></i>`;
                    }   
                    else
                    {   
                        batteryClass = `<i class="fa fa-battery-0" style="color:red"></i>`;
                    }   

                    level--;
                    document.getElementById("batteryDisplay").innerHTML ="Battery: " + level + "%" + batteryClass;
                    oxygenTimer();
                }   
                else
                {   
                    document.getElementById("oxygenDisplay").innerHTML ="Battery: 0%";
                    alert("OUT OF Battery");
                }   
            }   

            function oxygenTimer(){
                if(oxygenLevel>0)
                {   

                    oClass = `<i class="fa fa-battery-full" style="color:green"></i>`;

                    if(oxygenLevel>=85)
                    {   
                        oClass = `<i class="fa fa-battery-4" style="color:green"></i>`;
                    }
                    else if(oxygenLevel>=70 && oxygenLevel<85)
                    {
                        oClass = `<i class="fa fa-battery-three-quarters" style="color:green"></i>`;
                    }
                    else if(oxygenLevel>=60 && oxygenLevel<70)
                    {
                        oClass = `<i class="fa fa-battery-3" style="color:green"></i>`
                    }
                    else if(oxygenLevel>=50 && oxygenLevel<60)
                    {
                        oClass = `<i class="fa fa-battery-half" style="color:yellow"></i>`
                    }
                    else if(oxygenLevel>=35 && oxygenLevel<50)
                    {
                        oClass = `<i class="fa fa-battery-2" style="color:yellow"></i>`
                    }
                    else if(oxygenLevel>=15 && oxygenLevel<35)
                    {
                        oClass = `<i class="fa fa-battery-quarter" style="color:red"></i>`
                    }
                    else
                    {
                        oClass = `<i class="fa fa-battery-0" style="color:red"></i>`
                    }

                    document.getElementById("oxygenDisplay").innerHTML ="Oxygen: " + oxygenLevel + "%" + oClass;
                    oxygenLevel = oxygenLevel -2.5;
                }
                else{
                    document.getElementById("oxygenDisplay").innerHTML ="Oxygen: 0%";
                    alert("OUT OF Oxygen");
                }
            }

            setInterval(batteryTimer, 10000);

