//Obtener el formulario
const form = document.getElementById("form");
//obtener la barra de busqueda
const search = document.getElementById("search");

//Obtener el gidget del usuario
const userCard = document.getElementById("userCard");


//Escuchar el evento submit del form
//El evento submit es cuando se presiona enter en un
//formulario
form.addEventListener("submit", (evt=>{
  //No quiero cargar la pagina caso volverlo SPA
  //Te previene de haga lo que tiene que hacer
  evt.preventDefault();
  const username = search.value;
  getUserData(username);
  search.value = "";
}));

//obtener la info del usuario en github
async function getUserData(username){
  //Esta es la forma de obtener una api por medio de un
  //Link y luego convertirlo a JSOn que tambiene es
  //arreglo
  const linkApi = "https://api.github.com/users/";
  try{
    const userRequest = await fetch(linkApi+username);
    //.ok Es un objeto o propiedad de userRequest
    //para verla pones console.log(userRequest)
    //devuelve un valor booleano
    if(!userRequest.ok){
      //Me tirara un status 404 que siginifica error
      //No conecto con el usuario que busca
        throw new Error(userRequest.status);
    }
  const userData =  await userRequest.json();

    
  //.public_repos ese objeto debe existir en la api
  //asi revisa bien
  if(userData.public_repos){
    //Aqui es importante saber buscar las cosas
    //Osea tiene que conocer muy bien la api
    //para ingresar el link correcto
    //actualmente fetch contiene el siguiente en enlace
   // https://api.github.com/users/nombreUser/repos
    //Ojo repos es algo ya establecido en github por eso debes conocer bien tu api
    const reposRequest = await fetch(linkApi+username+"/repos");
    //Obtengo la respuesta del request y lo paso a JSOn
    const reposData = await reposRequest.json();
    //?
    userData.repos = reposData;
  }
  showData(userData);
  }
  catch(error){
    showError(error.message);
  }

}
//Funcion para componer e hidratar el html del widget
//En otras palabras mostrar los datos obtenidos de la api
//en el html principal
function showData(userData){
  //Aqui estamos modificado el html usando ``
  //Importante es casi igual que PHP
  //Donde las variables se deben poner los nombre y todo
  let userContent = `
  <img src="${userData.avatar_url}" alt="avatar"
  >
  <h1>${userData.name}</h1>
  <p>${userData.bio}</p>

  <div class="data">
    <ul>
      <li>Followers: ${userData.followers}</li>
      <li>Following: ${userData.following}</li>
      <li>Repos: ${userData.public_repos}</li>
    </ul>
  </div>

  
`;

if(userData.repos){
  console.log(userData.repos);
  userContent += `
  <div class="repos">`;

  //Me da una nueva matriz con los indices que marca
  //Osea que sera los arreglos con indice 0 y 7
  userData.repos.slice(0,7).forEach((repo)=>{

    //Template string
    userContent += `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`
  })

  userContent += `</div>`
      
}

userCard.innerHTML= userContent;
}

//Funcion para gestionar los errores
function showError(error){
    const errorContent = `<h1>Error 🚫 ${error}</h1>`
    userCard.innerHTML= errorContent;
}