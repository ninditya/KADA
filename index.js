import express from 'express';

const app = express();
const port = 3000;

// app.use((req, res, next) => {
//   if (true) {
//     // next(new Error('Not Authorized'));
//     next("Not Authorized");
//     return;
//   }
//   next();
// });

app.get('/', (req, res) => {
  res.send('Hello Nindit!')
});

// Using path parameters
app.get('/say/:greeting', (req, res) => {
  const { greeting } = req.params;
  res.send(greeting);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// app.use((err, req, res, next) => {
//   console.log('Error middleware executed:', err.message);
//   res.status(500).send('Internal Server Error');
// });