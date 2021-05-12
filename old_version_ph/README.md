## Breve explicação sobre o projeto.

Tenterei, suscintamente, resumir o que planejei nesse final de semana. Por favor, achem o que podemos melhorar.

Pragmaticamente falando, os scripts serão administrados nos seguintes arquivos (todos esses presentes na pasta /script):
* Docm -> docManager
* Mdl ou Slx -> mdlManager

Hoje, os respectivo manager é chamado assim que o arquivo é enviado.

## *Dica*

Instale todas as dependências do npm na sua máquina com

> npm install

Instale globalmente o nodemon, essa é uma ferramenta que reexecuta o seu código toda vez que você salvar o arquivo. Dessa forma você não precisa matar e reiniciar o servidor a cada mudança.

>npm install -g nodemon

É necessário ter a API do Matlab para Python, para que o script mdlManeger possa funcionar. O download pode ser encontrado [aqui](https://www.mathworks.com/help/matlab/matlab_external/install-the-matlab-engine-for-python.html)

## Para rodar o projeto.

Para rodar o projeto faça:

>nodemon app.js

## Acessando o site no seu computador

Acesse a aplicação no endereço:

>localhost:3030

Depois que seu server estiver online.

## Status do projeto.

Os scripts para mdl/slx e também para docm já estão funcionando completamente.

No docManager, o conteúdo xml do arquivo desejado é retorna da função:
>extractXmlFromDoc(fileAdress, internalFileNeeded);

Você pode exibilo no console com:
>       extractXmlFromDoc(fileAdress, internalFileNeeded).then((result) => {   
>       console.log(result);
>       });
