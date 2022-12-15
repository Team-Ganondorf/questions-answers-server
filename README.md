# Atelier RESTful API - Questions and Answers Server
Our team was tasked with reimplementing the Atelier API, a retail API, to scale for higher web traffic. We split the API into four services, and I worked on the questions and answers service. Q and A deals with read requests for questions and answers that haven't been reported, as well as marking questions and answers as helpful or reporting them. 

## Tech Stack
![Postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Express](https://img.shields.io/badge/-Express-DCDCDC?logo=express&logoColor=black&style=for-the-badge)
![Node](https://img.shields.io/badge/-Node-9ACD32?logo=node.js&logoColor=white&style=for-the-badge)
![Mocha](https://img.shields.io/badge/-mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white)

## Database Layout
<img width="1173" alt="SDC Q and A DB Model" src="https://user-images.githubusercontent.com/57077900/207983829-fe198544-6f47-4e0a-80d0-ac856172deae.png">

## Technical Challenges
- The serial numbers used for the primary keys were inaccurate after uploading the legacy csv files. I utlized setval(value, new value) to update the serial numbers.
- The data for dates was formatted as an epoch timestamp. I used TO_CHAR(TO_TIMESTAMP(date / 1000), 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') to format the date properly for the front end.
- The GET requests for questions and answers required nested objects and arrays. I used PostgreSQL's aggregation and JSON functions, mainly json_build_object and json_agg.
- The GET requests for questions and answers had unreasonably long latencies. I utilized indexing to reduce the latencies for all requests. This was most apparent in the GET questions request when the latency was reduced from 654ms to 28ms.

## Request Latencies
| Method | Questions(ms) | Answers(ms) |
| --- | --- | --- |
| GET | 28 | 17 |
| POST | 25 | 14 |
| PUT helpful | 23 | 11 |
| PUT report | 8 | 9 |

## Future Improvements
- Use load testing service like loader.io to stress test
- Use results from load testing to target weakpoints and strengthen them
