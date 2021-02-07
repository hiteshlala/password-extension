const server = 'https://hiteshlala.biz';
let passwords = [];
let auth;
let index = 0;

const loading = document.getElementById( 'loading' );
const logout = document.getElementById( 'logout' );
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
      populateItem();
      logout.classList.remove( 'hide' );
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

function populateItem() {
  const i = passwords[ index ];
  page.innerText = `${i ? index + 1 : 0 } of ${passwords.length}`;
  if ( i ) {
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
      logout.classList.remove( 'hide' );
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
  logout.classList.add( 'hide' );
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