const express = require('express');

const app = express();
app.use(express.json());


const projects = [
  {
    id: "1",
    title: "Novo projeto",
    tasks: []
  },
];

let countRequisicao = 0;

/**
 * Middleware Global
 */

app.use((req, res, next) => {
  countRequisicao += 1;
  if(countRequisicao == 1) {
    console.log(`Foi feita: ${countRequisicao} requisição`);
  } else {
    console.log(`Foram feitas: ${countRequisicao} requisições`);
  }
  

  return next();
});

function checkIdExist(req, res, next) {
  var id = projects.find(item => item.id === req.params.id);
  if(!id) {
    return res.status(400).json({error: 'User not found on request Body'})
  }
  
  return next();
}

/**
 *   Rotas
 */
app.get('/projects', (req, res) => {
  return res.json(projects);
});

app.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;
  projects.push({
    id,
    title,
    tasks
  })
  return res.json(projects);
});

app.put('/projects/:id', checkIdExist ,(req, res) => {
  const { id } = req.params;
  const title = req.body.title;

  let project = projects.find(item => item.id === id);
  project.title = title;

  return res.json(project);
});

app.delete('/projects/:id', (req, res) => {
  const id = req.params.id;

  let projectIndex = projects.findIndex(item => item.id === id);
  projects.splice(projectIndex, 1);

  return res.json(projects);
});

app.post('/projects/:id/tasks', (req, res) => {
  const id = req.params.id;
  const { titleTask } = req.body;

  let project = projects.find(item => item.id === id);
  project.tasks.push(titleTask);

  return res.json(projects);
});


app.listen(3000);