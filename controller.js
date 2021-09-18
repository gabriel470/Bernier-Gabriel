const url = require('url');
//const { isPrimitive } = require('util');
let calcul = "";

// let plutôt que const pour permettre la modification dans createCours
function isPrime(num) {
  for (var i = 2; i < num; i++) {
    if (num % i === 0) return false;
  }

  return num > 1;
}

function countKeys(query){
  let compteur = 0;
  for(key in query)
    compteur++;

  return compteur;
}

exports.getMath = function (req, res) {
  let boolPasErreur = true;
  const params = url.parse(req.url, true)
  //if too many parameters
  if (countKeys(params.query) > 3 && (params.query.op == ' ' || params.query.op == '-' || params.query.op == '*' || params.query.op == '%' || params.query.op == '/')) {
    params.query.error = "trop de parametre!";
    boolPasErreur = false;
  }
  else if (countKeys(params.query) > 2 && (params.query.op == '!' || params.query.op == 'p' || params.query.op == 'np')) {
    params.query.error = "trop de parametre!";
    boolPasErreur = false;
  }

  /*Règle le problème de s'il y a un paramètre, mais pas de valeur*/
  //If parameters are empty
  if (params.query.x == '') {
    params.query.x = "valeur manquante!"
    boolPasErreur = false;
  }
  if (params.query.y == '') {
    params.query.y = "valeur manquante!"
    boolPasErreur = false;
  }
  if (params.query.n == '') {
    params.query.n = "valeur manquante!"
    boolPasErreur = false;
  }
  
  //console.log(Object.keys(params.query)[1])
  //If parameters are upperCase
  if (Object.keys(params.query)[1] == 'N') {
    params.query.errorN = "n : parametre n manquant!";
    boolPasErreur = false;
  }
  if (Object.keys(params.query)[1] == "X") {
    console.log("allo")
    params.query.errorX = "x : parametre x manquant!";
    boolPasErreur = false;
  }
  if (Object.keys(params.query)[2] == 'Y') {
    params.query.errorY = "y : parametre y manquant!";
    boolPasErreur = false;
  }

  if(!params.query.op){
    params.query.error = "op : parametre manquant!";
    boolPasErreur = false;
  }

  //OPÉRATIONS
  if (boolPasErreur) {
    switch (params.query.op) {
      case ' ':
        params.query.op = '+'
        params.query.value = parseInt(params.query.x) + parseInt(params.query.y);
        break;
      case '-':
        params.query.value = parseInt(params.query.x) - parseInt(params.query.y);
        break;
      case '*':
        params.query.value = parseInt(params.query.x) * parseInt(params.query.y);
        break;
      case '%':
        if(params.query.y != 0)
          params.query.value = parseInt(params.query.x) % parseInt(params.query.y);
        else if ((params.query.x != 0 && params.query.y == 0) || (params.query.x == 0 && params.query.y == 0))
          params.query.value = "NaN";
        break;
      case '/':
        if(params.query.y != 0)
          params.query.value = parseInt(params.query.x) / parseInt(params.query.y);
        else if(params.query.x != 0 && params.query.y == 0)
          params.query.value = "Infinity";
        else
          params.query.value = "NaN";
        break;
      case '!':
        nb = parseInt(params.query.n);
        rep = 1;
        for (var i = 1; i <= nb; i++)
          rep = i * rep
        params.query.value = rep;
        break;
      case 'p':
        nb = parseInt(params.query.n)
        params.query.value = true;
        for (var i = 2; i < nb; i++)
          if (nb % i === 0) {
            params.query.value = false; break;
          }
        break;
      case 'np':
        let compteur = 0;
        nb = parseInt(params.query.n)
        for (let i = 1; true; ++i) {
          if (isPrime(i)) {
            ++compteur;
          }
          if (compteur === nb) {
            params.query.value = i;
            break;
          }
        }
        break;

      default:
        params.query.op = "operation inconnu!";
        break;
    }
  }

  calcul = params.query;
  res.statusCode = 200;
  res.setHeader('content-Type', 'Application/json');
  res.end(JSON.stringify(calcul))
}

exports.invalidUrl = function (req, res) {
  var response = [
    {
      "message": "Endpoint incorrect. Les options possibles sont "
    },
    availableEndpoints
  ]
  res.statusCode = 404;
  res.setHeader('content-Type', 'Application/json');
  res.end(JSON.stringify(response))
}

const availableEndpoints = [
  {
    method: "GET",
    getMath: "/api/maths?op=+&x=&y="
  },
  {
    method: "GET",
    getMath: "/api/maths?op=-&x=&y="
  },
  {
    method: "GET",
    getMath: "/api/maths?op=*&x=&y="
  },
  {
    method: "GET",
    getMath: "/api/maths?op=/&x=&y="
  },
  {
    method: "GET",
    getMath: "/api/maths?op=%&x=&y="
  },
  {
    method: "GET",
    getMath: "/api/maths?op=!&x=&y="
  },
  {
    method: "GET",
    getMath: "/api/maths?op=p&x=&y="
  },
  {
    method: "GET",
    getMath: "/api/maths?op=np&x=&y="
  },

]