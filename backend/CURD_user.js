fetch('http://localhost:5000/api/users', {
  method: 'POST',
  body: JSON.stringify({
    "isAdmin": false,
    "_id": "07fba7d7cc439d8b22e006cf",
    "user_id": 1000,
    "username": "1feng_user",
    "password": "1feng1234",
    "age": 1121,
    "phone": "1+85296684538",
    "gender": "Male",
    "language": "Chinese",
    "email": "1feng@example.com"
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
  .then(res => res.json())
  .then(console.log)

fetch('http://localhost:5000/api/users/67fba7d7cc439d8b22e006c6', {
  method: 'PUT',
  body: JSON.stringify({
    "isAdmin": false,
    "_id": "67fba7d7cc439d8b22e006c6",
    "user_id": 1,
    "username": "adventure_jane",
    "email": "jane@example.com",
    "password": "hashed1234",
    "age": 2800,
    "gender": "Female",
    "language": "English",
    "phone": "+1234567899"
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
  .then(res => res.json())
  .then(console.log)

fetch('http://localhost:5000/api/users/67fba7d7cc439d8b22e006c6', {
  method: 'PUT',
  body: JSON.stringify({
    "isAdmin": false,
    "_id": "67fba7d7cc439d8b22e006c6",
    "user_id": 1,
    "username": "adventure_jane",
    "email": "jane@example.com",
    "password": "hashed1234",
    "age": 2800,
    "gender": "Female",
    "language": "English",
    "phone": "+1234567899"
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
  .then(res => res.json())
  .then(console.log)

fetch('http://localhost:5000/api/users/67fba7d7cc439d8b22e006c7', {
  method: 'DELETE',
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
  .then(res => res.json())
  .then(console.log)