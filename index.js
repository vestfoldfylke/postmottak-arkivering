const { getGraphClient } = require("./lib/graph-client")

const azureTest = async () => {

  const client = getGraphClient()
  const test = await client.api('/users/huhuhu/messages').select('subject').get()
  console.log(test)
}

module.exports = { azureTest }

/*
Gå gjennom køen - for hver epost:
Hent ut data / parse skiten - så vi har dataen vi trenger
Sjekk om vi kjenner igjen e-post basert på gitte kriterier
Hvis vi kjenner den igjen, så kan vi arkivere den hvis har de dataene vi trenger
Flytt den til fullført mappe i postboks, eller en annen mappe 
*/

/*
Når ny epost (Power Automate) - kjør denne funksjonen


graph/emails/delta

alle eposter - token som jeg kan mellomlagre

graph/emails/

alle 

lytt på en mappe, mellomlagre i jobben vår (slipper å hente alle eposter hver gang)
når ferdig flytt til en mappe som vi IKKE lytter på

*/

