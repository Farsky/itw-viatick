# Viatick Interview Test - Sands Grand Ballroom - Fire Protection System

Created by: [Nguyen Vien Thien](mailto:farsky_vt@yahoo.com)

Created date: 2021-10-24

========

This documentation is intented for the interviewers of this test ([Edmund Gair](mailto:edmund@viatick.com) and [Anna Polubatko](mailto:anna@viatick.com)). The following steps will help you review this repository.

## Getting Started
- Open [index.html](index.html) from the root folder to see the map.
- The exits are marked with a green icon and will display their names when hovering.
- The zones A-P are marked with black dot icons and have their names display above the dot.
- To enable/disable an exit entrance:
  - Open Developer Console in your browser (the hotkey is usually F12 or Ctrl-Shift-I).
  - Execute script `exitEntrance[<index>].disableEntrance(<isDisabled>)`
    - `index` ranges from 0 to 3 and correspond to Exit 1 - 4.
    - `isDisabled` takes a boolean value, `true` will disable the exit and `false` will enable the exit.
  - The marker will change from green to red when the exit is disabled.
- To indicate fire locations:
  - Open Developer Console in your browser (the hotkey is usually F12 or Ctrl-Shift-I).
  - Execute `cache.enhancedLocations[<index>].toggleFireWarning(<isOnFire>)`
    - `index` ranges from 0 to `cache.enhancedLocations - 1`.
    - `isOnFire` takes a boolean value, `true` indicates the location is on fire and `false` removes the indication.
  - The marker will change from black to red when the location is on fire.
- To show the escape route from zone A - P to the nearest exit:
  - Open Developer Console in your browser (the hotkey is usually F12 or Ctrl-Shift-I).
  - Execute script `drawEscapeRoute(<zoneName>)`
    - `zoneName` is the display name of a zone.
    - For example, execute `drawEscapeRoute('Zone D')` will draw a blue dotted path from 'Zone D' to 'Exit 2'.
  - NOTE: The exits aren''t part of the returning JSON by Mappedin, I can only draw the route from a zone to the location nearest to the exit.

## Tests
No test is available at the moment

## API
No API endpoint is available at the moment

## References
- [Mappedin + Leaflet](https://github.com/davemuir/stoBU/tree/49ced477ffc5cc8ea77a1728333b2839115cb7e7/public/mappedin_api)
- [Leaflet](https://leafletjs.com/reference-1.7.1.html)
- [Sequelize](https://sequelize.org/)
- [Mappedin](https://github.com/MappedIn/platform-api)
- [Formula to calculate escape route](https://www.omnicalculator.com/math/hypotenuse)
- [MySQL free hosting](https://www.freesqldatabase.com/)
- [Sequelize + MySQL](https://www.esparkinfo.com/node-js-with-mysql-using-sequelize-express.html)
- [Sequelize + MySQL](https://www.bezkoder.com/node-js-express-sequelize-mysql/)