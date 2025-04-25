function checkAuthStatus(){
	const token = localStorage.getItem('token');
	const user = JSON.parse(localStorage.getItem('user'));

	const currentPage = window.location.pathname.split('/').pop();

	if(token){
		if (currentPage === 'login.html' || currentPage === '' || currentPage === '/') {
            window.location.href = 'index.html';
        }
		//else {
		//	// Token yoksa ve korumalı sayfadaysa, login sayfasına yönlendir
		//	if (currentPage !== 'login.html' && currentPage !== '') {
		//		window.location.href = 'index.html';
		//	}
		//}
	}
}
document.addEventListener('DOMContentLoaded', checkAuthStatus);

document.querySelector('.signbtn').addEventListener('click',()=>{
	const name = document.getElementById('inputName').value;
	const email = document.getElementById('signmail').value;
	const password = document.getElementById('signpassword').value;
	console.log("name = ",name);
	console.log("email = ",email);
	console.log("password = ",password);

	fetch('http://localhost:5000/register',{
		method:'post',
		headers:{
			 'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name, email, password })
	})
	.then(res => res.json())
	.then(data => alert(data));
});

document.querySelector('.loginbtn').addEventListener('click',()=>{
	const email = document.getElementById('loginmail').value;
	const password = document.getElementById('loginpassword').value;
	fetch('http://localhost:5000/login',{
		method: 'post',
		headers :{
			'Content-Type': 'application/json'
	   },
	   body : JSON.stringify({email, password})
	})
	.then(res => {
		console.log("Status kod:", res.status);
        return res.json();
	})
	.then(data => {
		console.log("Server yanıtı:", data);
        
        if (data.message) {
            alert(data.message);
        } else if (data.token) {
            // Başarılı giriş
            alert("Giriş başarılı!");
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            // Kullanıcıyı ana sayfaya yönlendir
            window.location.href = 'index.html';
        } else {
            alert("Bilinmeyen bir hata oluştu");
        }
	})
	.catch(err => {
        console.error("Fetch hatası:", err);
        alert("Bağlantı hatası oluştu");
    });
});

//document.getElementById('bookbtn').addEventListener('click',()=>{
//	const selectElement = document.querySelector('.bookservice');
//	const bookservice = selectElement.options[selectElement.selectedIndex].text;
//	const bookdate = document.getElementById('bookdate').value;
//	const booktime = document.getElementById('booktime').value;
//	console.log(bookservice);
//	console.log(bookdate);
//	console.log(booktime);
//	fetch(('http://localhost:5000/book'),{
//		method : 'post',
//		headers:{'Content-Type': 'application/json'},
//		body : JSON.stringify({bookservice, bookdate, booktime})
//	})
//	.then(res => res.text())
//	.then(data => alert(data));
//});