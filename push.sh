
 YML="<yml file name>"
 
  
 SPACE="<project space name>"
 
  
  cf target -s $SPACE
  cf push -f $YML
