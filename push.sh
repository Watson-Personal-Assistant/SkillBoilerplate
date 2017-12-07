
 YML="<your manifest file name>"


 SPACE="<your target space>"

 ORGANIZATION="<your bluemix organization>"


  bx target -s $SPACE -o $ORGANIZATION
  bx app push -f $YML
