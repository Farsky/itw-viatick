# Viatick Interview Test - Sands Grand Ballroom - Fire Protection System

Created by: [Nguyen Vien Thien](mailto:farsky_vt@yahoo.com)

Created date: 2021-10-24

========

This documentation is intented for the interviewers of this test ([Edmund Gair](mailto:edmund@viatick.com) and [Anna Polubatko](mailto:anna@viatick.com)). The following steps will help you review this repository.

## 1. Getting Started
- Open the terminal of your choice from the root folder (cmd/Powershell/etc) and type `npm run dev` to start the application.
- Browse `http://localhost:3000` to see the map.
- The exits are marked with a green icon and will display their names when hovering.
- The zones A-P are marked with black dot icons and have their names display above the dot.
- To enable/disable an exit entrance:
  - Open Developer Console in your browser (the hotkey is usually F12 or Ctrl-Shift-I).
  - Execute script `ViatickMap.toggleExit(name, isActive)`
    - `name` is the display text over each exit (case-sensitive)
    - `isActive` takes a boolean value, `true` will enable the exit and `false` will disable the exit.
  - The marker will change from green to red when the exit is disabled.
- To indicate that a location is on fire:
  - Open Developer Console in your browser (the hotkey is usually F12 or Ctrl-Shift-I).
  - Execute `ViatickMap.toggleLocation(name, isOnFire)`
    - `name` is the display text over each zone (case-sensitive)
    - `isOnFire` takes a boolean value, `true` indicates the location is on fire and `false` removes the indication.
  - The marker will change from black to red when the location is on fire.
- To show the escape route from zone A - P to the nearest exit:
  - Open Developer Console in your browser (the hotkey is usually F12 or Ctrl-Shift-I).
  - Execute script `ViatickMap.drawEscapeRoute(name)`
    - `name` is the display name of a zone.
    - For example, execute `ViatickMap.drawEscapeRoute('Zone D')` will draw a blue dotted path from 'Zone D' to 'Exit 2'.
  - NOTE: The exits aren''t part of the returning JSON by Mappedin, I can only draw the route from a zone to the location nearest to the exit.
- To clear the escape route:
  - Open Developer Console in your browser (the hotkey is usually F12 or Ctrl-Shift-I).
  - Execute script `ViatickMap.clearEscapeRoute()`

## 2. Tests
No test is available at the moment

## 3. API
### Exit API
| Endpoint | Method | Description |
|--|--|--|
| /api/exits | GET | Get all exits |
| /api/exits/active | GET | Get all active exits |
| /api/exits/:id/:isActive | PUT | Enable/disable an exit |

### Location API
| Endpoint | Method | Description |
|--|--|--|
| /api/locations | GET | Get all locations |
| /api/locations/active | GET | Get all active locations |
| /api/locations | POST | Register a Location (this location will be able to have an escape route) |
| /api/locations/:id | PUT | Toggle fire warning on a Location |
| /api/locations/:id | DELETE | Unregister a Location |

## 4. References
- [Mappedin + Leaflet](https://github.com/davemuir/stoBU/tree/49ced477ffc5cc8ea77a1728333b2839115cb7e7/public/mappedin_api)
- [Leaflet](https://leafletjs.com/reference-1.7.1.html)
- [Sequelize](https://sequelize.org/)
- [sequelize/cli](https://github.com/sequelize/cli)
- [Mappedin](https://github.com/MappedIn/platform-api)
- [Formula to calculate escape route](https://www.omnicalculator.com/math/hypotenuse)
- [MySQL free hosting](https://www.freesqldatabase.com/)
- [Sequelize + MySQL](https://www.esparkinfo.com/node-js-with-mysql-using-sequelize-express.html)
- [Sequelize + MySQL](https://www.bezkoder.com/node-js-express-sequelize-mysql/)