const { ApolloServer, gql } = require('apollo-server');
const {authors,books} = require("./data")
var fs = require('fs');
var jsondata = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

const typeDefs = gql`
#USER
input createUserInput{
  id: ID
  username: String
  email: String
}

input updateUserInput{
  id: ID
  username: String
  email: String
}

#EVENT
input createEventInput{
  id: ID
  title: String
  desc: String
  date: String
  from: String
  to: String
  location_id: ID
  user_id: ID
}

input updateEventInput{
  id: ID
  title: String
  desc: String
  date: String
  from: String
  to: String
  location_id: ID
  user_id: ID
}

#LOCATION
input createLocationInput{
   id: ID
  name: String
  desc: String
  lat: Float
  lng: Float
}

input updateLocationInput{
  id: ID
  name: String
  desc: String
  lat: Float
  lng: Float
}

#PARTICIPANT
input createParticipantInput{
  id: ID
  user_id: ID
  event_id: ID
}

input updateParticipantInput{
  id: ID
  user_id: ID
  event_id: ID
}

type Participants {
  id: ID
  user_id: ID
  event_id: ID
  username: String
}

type Users {
  id: ID
  username: String
  email: String
  events:[Events]
}

type Locations {
  id: ID
  name: String
  desc: String
  lat: Float
  lng: Float
}

type Events {
  id: ID
  title: String
  desc: String
  date: String
  from: String
  to: String
  location_id: ID
  user_id: ID
  user: Users
  location: Locations
  participants : [Participants]
}

type Query{
participants : [Participants]
users : [Users]
locations :[Locations]
events : [Events]
user(id:ID): Users
event(id:ID): Events

}

type DeleteAllOutput{
count : Int
}

type Mutation{

#USER
createUser(data:createUserInput!):Users!
updateUser(id:ID,data: updateUserInput!):Users!
deleteUser(id:ID):Users!
deleteAllUsers: DeleteAllOutput!

#Event
createEvent(data:createEventInput!):Events!
updateEvent(id:ID,data: updateEventInput!):Events!
deleteEvent(id:ID):Events!
deleteAllEvents: DeleteAllOutput!


#Location
createLocation(data:createLocationInput!):Locations!
updateLocation(id:ID,data: updateLocationInput!):Locations!
deleteLocation(id:ID):Locations!
deleteAllLocations: DeleteAllOutput!

#Participant
createParticipant(data:createParticipantInput!):Participants!
updateParticipant(id:ID,data: updateParticipantInput!):Participants!
deleteParticipant(id:ID):Participants!
deleteAllParticipants: DeleteAllOutput!

}
`

const resolvers = {
    Query:{
    participants: () => jsondata.participants,
    users: () => jsondata.users,
    locations: () => jsondata.locations,
    events: () => jsondata.events,
    user :(parent,args) =>{
        
        const datas = jsondata.users.find((user)=>(user.id)==args.id);
        return datas 
    },
    event :(parent,args) =>{
        
        const datas = jsondata.events.find((event)=>(event.id)==args.id);
        return datas 
    }
    },
    Users :{
        events:(parent,args) => {      
                return jsondata.events.filter((event)=>event.user_id==parent.id)
        }

    },
    Events :{
        user: (parent,args) => {
                return jsondata.users.find((user)=>user.id==parent.user_id)
        },
        location :(parent,args) => {
            return jsondata.locations.find((location)=>location.id==parent.location_id)
        },
        participants :(parent,args) => { 
            return jsondata.participants.filter((part)=>part.event_id==parent.id)
       }
    },
    Participants :{
        username:(parent,args) => {      
                const user = jsondata.users.find((user)=>user.id==parent.user_id)
                return user.username
        }

    },
    Mutation:{

      //USER 
      createUser: (parent,{data}) => {
    
        const user = {
          id: data.id,
          username: data.username,
          email: data.email
        }
       
        jsondata.users.push(user)
        return user
      },
      updateUser: (parent,{id,data}) => {
        const user_index = jsondata.users.findIndex((user) => user.id == id )
        console.log(user_index)
         if(user_index === -1)
         {
            throw new Error('User not found')
         }
         const updatedUser = jsondata.users[user_index] = {
          ...jsondata.users[user_index],
          ...data
          
        }
        return updatedUser;
      },

      deleteUser: (parent,{id}) => {
        const user_index = jsondata.users.findIndex((user) => user.id == id)
        console.log(user_index)
        if(user_index == -1) {
          throw new Error('User not found')
        }
        const deletedUser = jsondata.users[user_index]
       
       
        jsondata.users.splice(user_index,1)
        
        return deletedUser
      },
      deleteAllUsers: () => {
        const length = jsondata.users.length
        jsondata.users.splice(0,length)
        return {
          count: length
        }
      },


      //Event
      createEvent: (parent,{data}) => {
    
        const event = {
          ...data
        }
       
        jsondata.events.push(event)
        return event
      },
      updateEvent: (parent,{id,data}) => {
        const event_index = jsondata.events.findIndex((event) => event.id == id )
        console.log(event_index)
         if(event_index === -1)
         {
            throw new Error('Event not found')
         }
         const updatedEvent = jsondata.events[event_index] = {
          ...jsondata.events[event_index],
          ...data
          
        }
        return updatedUser;
      },

      deleteEvent: (parent,{id}) => {
        const event_index = jsondata.events.findIndex((event) => event.id == id)
        console.log(event_index)
        if(event_index == -1) {
          throw new Error('Event not found')
        }
        const deletedEvent = jsondata.events[event_index]
       
       
        jsondata.events.splice(event_index,1)
        
        return deletedEvent
      },
      deleteAllEvents: () => {
        const length = jsondata.events.length
        jsondata.events.splice(0,length)
        return {
          count: length
        }
      },

      //Location
      createLocation: (parent,{data}) => {
    
        const location = {
          ...data
        }
       
        jsondata.locations.push(location)
        return location
      },
      updateLocation: (parent,{id,data}) => {
        const location_index = jsondata.locations.findIndex((location) => location.id == id )
        console.log(location_index)
         if(location_index === -1)
         {
            throw new Error('Location not found')
         }
         const updatedLocation = jsondata.locations[location_index] = {
          ...jsondata.locations[location_index],
          ...data
          
        }
        return updatedLocation;
      },

      deleteLocation: (parent,{id}) => {
        const location_index = jsondata.locations.findIndex((location) => location.id == id)
        console.log(location_index)
        if(location_index == -1) {
          throw new Error('Location not found')
        }
        const deletedLocation = jsondata.locations[location_index]
       
       
        jsondata.locations.splice(location_index,1)
        
        return deletedLocation
      },
      deleteAllLocations: () => {
        const length = jsondata.locations.length
        jsondata.locations.splice(0,length)
        return {
          count: length
        }
      },
      //Participant
      createParticipant: (parent,{data}) => {
    
        const participant = {
          ...data
        }
       
        jsondata.participants.push(participant)
        return participant
      },
      updateParticipant: (parent,{id,data}) => {
        const participant_index = jsondata.participants.findIndex((participant) => participant.id == id )
        console.log(participant_index)
         if(participant_index === -1)
         {
            throw new Error('Participant not found')
         }
         const updatedParticipant = jsondata.participants[participant_index] = {
          ...jsondata.participants[participant_index],
          ...data
          
        }
        return updatedParticipant;
      },

      deleteParticipant: (parent,{id}) => {
        const participant_index = jsondata.participants.findIndex((participant) => participant.id == id)
        console.log(participant_index)
        if(participant_index == -1) {
          throw new Error('Participant not found')
        }
        const deletedParticipant = jsondata.participants[participant_index]
       
       
        jsondata.participants.splice(participant_index,1)
        
        return deletedParticipant
      },
      deleteAllParticipants: () => {
        const length = jsondata.participants.length
        jsondata.participants.splice(0,length)
        return {
          count: length
        }
      }
    } 

};

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => console.log(`Apollo Server is Up at ${url}`));