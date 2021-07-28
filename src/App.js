import React, { useRef, useState } from 'react';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import image1 from './image1.jpg'


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyB7h9U0qODNG7c0d4pHzqJRT2K-NxKrMxc",
  authDomain: "firechat-990d3.firebaseapp.com",
  projectId: "firechat-990d3",
  storageBucket: "firechat-990d3.appspot.com",
  messagingSenderId: "567852833611",
  appId: "1:567852833611:web:b672dc37a3078db363a6ce"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth=firebase.auth();
const firestore=firebase.firestore();



function App() {
  const [user]=useAuthState(auth);
  
  return (
    <div className="App">
      
      <section>
        { user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}
function SignOut(){

  return(
    <button onClick={()=>auth.signOut()}>Sign Out</button>
  )
}
let violet=true;

function ChatRoom(){
  //accessing firestore
  const dummy=useRef();
  const messagesRef=firestore.collection("messages");
  const query =messagesRef.orderBy("createdAt").limit(25);

  //creating array for accessed data
  const [messages]=useCollectionData(query, { idField: 'id' });

  //useState for form input
  const [formValue, setFormValue] = useState('');

  const sendMessage=async(e)=>{
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }
  
  
  
  return(
    <div className="chatroom">
      <div className= "chat-header">
        <div className="app-name">
            <h1>QUICKFIRE</h1>
            
            
            
        </div>
        
        <div className="signout-btn">
              <SignOut/>
        </div>
      </div>
      <div className="chat-section">
        {messages && messages.map(msg=> <ChatMessage key={msg.id} message={msg} />) }
        <span ref={dummy}></span>
      </div>
      <div className="input-form">
        <form action="" onSubmit={sendMessage}>
          <input type="text" value={formValue} onChange={(e)=>setFormValue(e.target.value) } placeholder="Type a message"/>
          <button type="submit" disabled={!formValue}><i className="fa fa-paper-plane"></i></button>
        </form>
      </div>
      
    </div>
  )
}
function SignIn(){
  const signInWithGoogle=()=>{
    const provider=new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(

    <div className="sign-in-container">
      
        <div className="app-name2">
          <h1>🔥QUICKFIRE🔥</h1>
        </div>
        <div className="app-name3">
          <h2>A GLOBAL CHAT ROOM</h2>
        </div>
        <div className="sign-in-btn">
          <button onClick={signInWithGoogle}>Sign In With Google <i className="fa fa-google"></i></button>
        </div>
        <div className="sign-in-img">
          <div className="temp1">
            <img src={image1} alt=""  />
          </div>
          <br />
          <h4>| DISCLAIMER |</h4>
        </div>
        <div className="disclaimer">
          <br />
          <p>⚠️Use of bad language is strictly prohibited⚠️ <br /> | <br /> | <br />^</p>
          <br />
          
        </div>
        <div className="footer">
          <p>Made with 💖 by Pratik</p>
        </div>
        
        
        
      
      
      
    </div>
  )
}

function ChatMessage(props){
 const {text,uid,photoURL}=props.message;
 const messageClass=uid==auth.currentUser.uid? 'sent' : 'received';

  return(
    <div className={messageClass}>
        <img src={photoURL} alt="" />
        <p>{text}</p>
    </div>
  )
}

export default App;
