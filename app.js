const { APIGateway } = require('itrm-tools');

const apiGateway = new APIGateway();


 apiGateway = APIGateway.getInstance();


apiGateway.get('/person', (req, res) => {
    const person = {
      name: 'John Doe',
      age: 30,
    };
  
    res.send(person);
  });
  
  apiGateway.listen(3000);