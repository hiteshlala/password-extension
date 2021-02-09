const server = 'https://hiteshlala.biz';
let passwords = [];
let auth;
let index = 0;
let editing;

const loading = document.getElementById( 'loading' );
const submitlogout = document.getElementById( 'submitlogout' );
const login = document.getElementById( 'login' );
const submitlogin = document.getElementById( 'submitlogin' );
const username = document.getElementById( 'username' );
const password = document.getElementById( 'password' );
const loginmsg = document.getElementById( 'loginmsg' );
const message = document.getElementById( 'message' );
const search = document.getElementById( 'search' );
const results = document.getElementById( 'results' );
const query = document.getElementById( 'query' );
const left = document.getElementById( 'left' );
const right = document.getElementById( 'right' );
const page = document.getElementById( 'page' );
const item = document.getElementById( 'item' );
const clear = document.getElementById( 'clear' );

const ititle = document.getElementById( 'i-title' );
const iurl = document.getElementById( 'i-url' );
const iusername = document.getElementById( 'i-username' );
const ipassword = document.getElementById( 'i-password' );
const iaccountno = document.getElementById( 'i-accountno' );
const ichallenge1 = document.getElementById( 'i-challenge1' );
const ichallenge2 = document.getElementById( 'i-challenge2' );
const iemail = document.getElementById( 'i-email' );
const inotestext = document.getElementById( 'i-notes-text' );

const pager = document.getElementById( 'pager' );
const additem = document.getElementById( 'additem' );
const adder = document.getElementById( 'adder' );
const adddelete = document.getElementById( 'adddelete' );
const addcancel = document.getElementById( 'addcancel' );
const addsubmit = document.getElementById( 'addsubmit' );
const editbutton = document.getElementById( 'editbutton' );
const edit = document.getElementById( 'edit' );


function getRequest( url ) {
  return new Promise(( resolve, reject ) => {
    let req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open( 'GET', url, true );
    auth && req.setRequestHeader( 'Authorization', auth );
    req.onload = r => {
      if( r.target.status >= 400 ) {
        reject( r.target.response );
      }
      else {
        resolve( req.response );
      }
    }
    req.onerror = e => {
      reject( e );
    }
    req.send();
  });
}

function postRequest( url, data = {} ) {
  let send = JSON.stringify( data );
  return new Promise(( resolve, reject ) => {
    let req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open( 'POST', url, true );
    auth && req.setRequestHeader( 'Authorization', auth );
    req.setRequestHeader( 'Content-Type', 'application/json;charset=UTF-8' );
    req.setRequestHeader( 'Accept', 'application/json' );
    req.onload = r => {
      if( r.target.status >= 400 ) {
        reject( r.target.response );
      }
      else {
        resolve( req.response );
      }
    }
    req.onerror = e => {
      reject( e );
    }
    req.send( send );
  });
}

function deleteRequest( url, data = {} ) {
  let send = JSON.stringify( data );
  return new Promise(( resolve, reject ) => {
    let req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open( 'DELETE', url, true );
    auth && req.setRequestHeader( 'Authorization', auth );
    req.setRequestHeader( 'Content-Type', 'application/json;charset=UTF-8' );
    req.setRequestHeader( 'Accept', 'application/json' );
    req.onload = r => {
      if( r.target.status >= 400 ) {
        reject( r.target.response );
      }
      else {
        resolve( req.response );
      }
    }
    req.onerror = e => {
      reject( e );
    }
    req.send( send );
  });
}

function patchRequest( url, data = {} ) {
  let send = JSON.stringify( data );
  return new Promise(( resolve, reject ) => {
    let req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open( 'PATCH', url, true );
    auth && req.setRequestHeader( 'Authorization', auth );
    req.setRequestHeader( 'Content-Type', 'application/json;charset=UTF-8' );
    req.setRequestHeader( 'Accept', 'application/json' );
    req.onload = r => {
      if( r.target.status >= 400 ) {
        reject( r.target.response );
      }
      else {
        resolve( req.response );
      }
    }
    req.onerror = e => {
      reject( e );
    }
    req.send( send );
  });
}

async function getUrl() {
  try {
    let tabs = await chrome.tabs.query({ 
      active: true, 
      // currentWindow: true, 
      lastFocusedWindow: true,
    });

    if ( tabs[0] && tabs[0].url ) {
      let url = new URL( tabs[0].url );
      let pieces = url.hostname.split( '.');
      if ( pieces.length > 3 ) {
        return pieces[ pieces.length - 2 ];
      }
      else if ( pieces.length === 3 ) {
        return pieces[1];

      }
      else if ( pieces.length === 2 ) {
        return pieces[0] 
      }
      else {
        return '';
      }
    }
  }
  catch(e) {
    console.error(e);
    return '';
  }
}

async function setup() {
  try {
    auth = await new Promise(resolve => chrome.storage.local.get( [ 'key' ], r => resolve(r.key) ));
    const init = await getRequest(`${server}/api/init`);
    loading.classList.add( 'hide' );
    if ( init.loggedIn ) {
      const q = await getUrl();
      const r = await getRequest( `${server}/api/passwords${q ? `?filter=${q}` : ''}` );
      passwords = r.passwords;
      query.value = q;
      disableItemEntry( true );
      populateItem();
      submitlogout.classList.remove( 'hide' );
      search.classList.remove( 'hide' );
      results.classList.remove( 'hide' );
    }
    else {
      login.classList.remove( 'hide' );
    }
  }
  catch(e) {
    console.error( e );
    loading.classList.add( 'hide' );
    message.innerText = `${e.message || e}`;
    message.classList.remove( 'hide' )
  }
}

function populateItem( newitem ) {
  const i = passwords[ index ];
  page.innerText = `${i ? index + 1 : 0 } of ${passwords.length}`;
  if ( newitem || !i ) {
    ititle.value = '';
    iurl.value = '';
    iusername.value = '';
    ipassword.value = '';
    iaccountno.value = '';
    ichallenge1.value = '';
    ichallenge2.value = '';
    iemail.value = '';
    inotestext.value = '';
  }
  else if ( i ) {
    ititle.value = i.title;
    iurl.value = i.url;
    iusername.value = i.username;
    ipassword.value = i.password;
    iaccountno.value = i.accountno;
    ichallenge1.value = i.challenge1;
    ichallenge2.value = i.challenge2;
    iemail.value = i.email;
    inotestext.value = i.notes;
  }
  
} 

function disableItemEntry( disable ) {
  ititle.disabled = disable;
  iurl.disabled = disable;
  iusername.disabled = disable;
  ipassword.disabled = disable;
  iaccountno.disabled = disable;
  ichallenge1.disabled = disable;
  ichallenge2.disabled = disable;
  iemail.disabled = disable;
  inotestext.disabled = disable;
}

async function querychange() {
  try {
    const r = await getRequest( `${server}/api/passwords?filter=${query.value}` );
    passwords = r.passwords;
    index = 0;
    populateItem();
  }
  catch(e) {
    console.error(e);
    message.innerText = `${e.message || e }`;
    message.classList.remove( 'hide' );
  }
}

submitlogin.addEventListener( 'click', async () => {
  try {
    const r = await postRequest( `${server}/api/login`, { username: username.value, password: password.value });
    if ( r.loggedIn ) {
      auth = r.key;
      await new Promise( resolve => chrome.storage.local.set( { key: r.key }, resolve ) );
      login.classList.add( 'hide' );
      submitlogout.classList.remove( 'hide' );
      password.value = '';
      search.classList.remove( 'hide' );
      results.classList.remove( 'hide' );
      const q = await getUrl();
      const p = await getRequest( `${server}/api/passwords${q ? `?filter=${q}` : ''}` );
      passwords = p.passwords;
      query.value = q;
      populateItem();
    } 
    else {
      loginmsg.innerText = `${r.message}`;
    }
  }
  catch( e ) {
    console.error(e);
    loginmsg.innerText = `${e.message || e}`;
  }
});

submitlogout.addEventListener( 'click', async () => {
  try {
    loading.classList.remove( 'hide' );
    await deleteRequest( `${server}/api/login`, {});
    loading.classList.add( 'hide' );
    await new Promise( resolve => chrome.storage.local.set( { key: '' }, resolve ) );
  }
  catch( e ) {
    console.error(e);
  }
  login.classList.remove( 'hide' );
  submitlogout.classList.add( 'hide' );
  search.classList.add( 'hide' );
  results.classList.add( 'hide' );
});

query.addEventListener( 'input', querychange);

left.addEventListener( 'click', async () => {
  try {
    if ( index > 0 ) {
      index--;
      populateItem();
    }
  }
  catch( e ) {
    console.error(e);
  }
});

right.addEventListener( 'click', async () => {
  try {
    if ( index < passwords.length - 1 ) {
      index++;
      populateItem();
    }
  }
  catch( e ) {
    console.error(e);
  }
});

clear.addEventListener( 'click', async () => {
  try {
    query.value = '';
    querychange();
  }
  catch( e ) {
    console.error(e);
  }
});

additem.addEventListener( 'click', async () => {
  try {
    search.classList.add( 'hide' );
    pager.classList.add( 'hide' );
    adder.classList.remove( 'hide' );
    adddelete.classList.add( 'hide' );
    editbutton.classList.add( 'hide' );
    populateItem( true );
    disableItemEntry( false );
    editing = undefined;
  }
  catch( e ) {
    console.error(e);
  }
});

addcancel.addEventListener( 'click', async () => {
  try {
    search.classList.remove( 'hide' );
    pager.classList.remove( 'hide' );
    adder.classList.add( 'hide' );
    adddelete.classList.remove( 'hide' );
    item.classList.remove( 'hide' );
    message.innerText = ``;
    message.classList.add( 'hide' );
    editbutton.classList.remove( 'hide' );
    populateItem();
    disableItemEntry( true );
    editing = undefined;
  }
  catch( e ) {
    console.error(e);
  }
});

addsubmit.addEventListener( 'click', async () => {
  try {
    item.classList.add( 'hide' );
    loading.classList.remove( 'hide' );

    const newEntry = {
      title: ititle.value,
      url: iurl.value,
      username: iusername.value,
      password: ipassword.value,
      accountno: iaccountno.value,
      challenge1: ichallenge1.value,
      challenge2: ichallenge2.value,
      email: iemail.value,
      notes: inotestext.value,
    };

    if ( editing ) {
      const tosubmit = Object.assign( {}, editing, newEntry );
      await patchRequest( `${server}/api/passwords/${tosubmit.id}`, tosubmit );
    }
    else {
      await postRequest( `${server}/api/passwords`, newEntry );
    }

    query.value = '';
    querychange();

    loading.classList.add( 'hide' );
    item.classList.remove( 'hide' );
    search.classList.remove( 'hide' );
    pager.classList.remove( 'hide' );
    adder.classList.add( 'hide' );
    adddelete.classList.remove( 'hide' );
    editbutton.classList.remove( 'hide' );
    populateItem();
    disableItemEntry( true );
    editing = undefined;
  }
  catch( e ) {
    console.error(e);
    loading.classList.add( 'hide' );
    message.innerText = `${e.message || e}`;
    message.classList.remove( 'hide' )
  }
});

edit.addEventListener( 'click', async () => {
  try {
    search.classList.add( 'hide' );
    pager.classList.add( 'hide' );
    adder.classList.remove( 'hide' );
    editbutton.classList.add( 'hide' );
    editing = passwords[ index ];
    populateItem();
    disableItemEntry( false );
  }
  catch( e ) {
    console.error(e);
  }
});

adddelete.addEventListener( 'click', async () => {
  try {
    item.classList.add( 'hide' );
    loading.classList.remove( 'hide' );
    await deleteRequest( `${server}/api/passwords/${editing.id}` );
    query.value = '';
    querychange();
    loading.classList.add( 'hide' );
    item.classList.remove( 'hide' );
    search.classList.remove( 'hide' );
    pager.classList.remove( 'hide' );
    adder.classList.add( 'hide' );
    editbutton.classList.remove( 'hide' );
    populateItem();
    disableItemEntry( true );
    editing = undefined;
  }
  catch( e ) {
    console.error(e);
    loading.classList.add( 'hide' );
    message.innerText = `${e.message || e}`;
    message.classList.remove( 'hide' )
  }
});

window.onload = () => {
  setup().catch(console.error );
};


/*

 <!-- <div className={css.but}>
          <input type="button" value="Cancel" onClick={handleCancel}/>
          { props.item && <input type="button" value="Delete" onClick={handleDelete}/>}
          <input type="button" disabled={!canSubmit} value="Submit" onClick={handleSubmit}/>
        </div> -->
        */