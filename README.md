![guessrupdated](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/5ee7aef4-d936-4ce2-a4a7-57c019810cc3)

<p align="center">
  <strong>School project</strong>
  •
  <a href="https://kbg.jooo.tech">
    <strong>Play🎮</strong>
  </a>
</p>
<p align="center">
Learn and become more familiar with Kongsberg in a fun and intuitive way!
</p>
<br>

## Features ✨
- Accounts
- Levels, Experience
- Leaderboard
- Geography Game
- Fun
- Multiplayer (rough)

## Screenshots

#### Landing "/" unlogged in
| Section 1 / Landing  | Section 2 / Features | Section 3 / Registration / Login |
| ------------- | ------------- | ------------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/96d3cf6a-75b8-41d1-a808-c325f1f18caa) | ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/c0edb0b9-787f-4191-8304-13cfc7f97d0c) | ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/3a89a9b0-5e03-4782-af2b-f99707c4bca6) |

| Section 1 / Landing |
| ------------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/96d3cf6a-75b8-41d1-a808-c325f1f18caa) |

| Section 2 / Features |
| ------------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/c0edb0b9-787f-4191-8304-13cfc7f97d0c) |

| Section 3 / Registration / Login |
| ------------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/3a89a9b0-5e03-4782-af2b-f99707c4bca6) |







#### Home/Dashboard "/" logged in
| Landing | Play/Selection | Leaderboard |
| ------------- | ------------- | ------------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/d9aa703a-a800-4745-be2c-778e29025df8) | ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/88779889-acd4-4307-8205-6c44e6813643) | ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/404f19fb-aeae-483a-98c4-feeacf43fa5b) |

| Landing |
| ------------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/d9aa703a-a800-4745-be2c-778e29025df8) |

| Play/Selection |
| ------------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/88779889-acd4-4307-8205-6c44e6813643) |

| Leaderboard |
| ------------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/404f19fb-aeae-483a-98c4-feeacf43fa5b) |

#### Multiplayer (actions)

| Action Selection |
| ---------------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/ee6ab742-0d30-4176-a603-9faa2ce2c813) |

| Room Creator |
| ------------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/80cf2188-9b9f-4398-a569-f2b060a1bf33) |

| Leaderboard |
| ------------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/b788fac0-05c5-4010-81fb-da8aef682022) |

#### Game
| Loading | 
| --------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/6f9d817a-f536-4046-807c-bcd42cc39f74) |

| In-game looking around | In-game selecting guess (hovering map) |
| ------- | -------  |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/ab3679cb-dbac-4910-bad8-4ec6380b6109) | ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/4c76204b-2f81-4c5e-9f13-27dad839b178) |

| Guess Submission |
| ------ |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/fbcc5db5-22c4-443b-8462-afa9b68a2df0) |

| Game Over (SOLO) |
| --------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/670f3b2d-5787-4f63-bdeb-5165ba432afa) |

##### Game PvP

| Waiting Screen (for other players to complete) |
| -------------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/438a7b1a-2dc7-45b5-a995-811f0b30c0ac) |


| Game Over (PvP) |
| --------------- |
| ![image](https://github.com/joseph-gerald/KongsberGuessr/assets/73967013/4e743176-9995-4ef7-aac6-729dae3a80ec) |

### Setting up a Workspace
```bash
git clone https://github.com/joseph-gerald/KongsberGuessr.git
cd website

npm i
npm run dev
```

.env.local
```js
// origin
NEXT_PUBLIC_ORIGIN="https://kbg.jooo.tech"

// public google api key ( restrictions: http refererer [e.g *.jooo.tech/*], apis [maps embed/javascript and streetview] )
NEXT_PUBLIC_API_KEY=""

// private google api key ( restrictions: ip and geocoding api )
PRIVATE_API_KEY=""

// mongoDB URI
MONGODB_URI=""
```
