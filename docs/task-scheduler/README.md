## Sample

Log of `npm test`:

```
 Sample events:

12:30 -> 14:00 : [EVT] dej avec yann (2)
00:00 -> 01:00 : [EVT] film a la tv (2)

 Sample tasks:

XX:XX -> XX:XX : [TSK] déclarer impots (1)
XX:XX -> XX:XX : [TSK] lessive (1)
XX:XX -> XX:XX : [TSK] coder feature 1 (2)
XX:XX -> XX:XX : [TSK] coder feature 2 (3)
XX:XX -> XX:XX : [TSK] coder feature 3 (4)

 Resulting schedule, after combining events and tasks:

10:00 -> 11:00 : [TSK] déclarer impots (1)
11:00 -> 12:00 : [TSK] lessive (1)
12:30 -> 14:00 : [EVT] dej avec yann (2)
14:00 -> 16:00 : [TSK] coder feature 1 (2)
00:00 -> 01:00 : [EVT] film a la tv (2)
10:00 -> 13:00 : [TSK] coder feature 2 (3)
13:00 -> 17:00 : [TSK] coder feature 3 (4)
```
