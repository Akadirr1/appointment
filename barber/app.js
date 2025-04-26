const currentPage = window.location.pathname.split('/').pop();
if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
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
                
                if (data.token) {
                    // Başarılı giriş
                    alert("Giriş başarılı!");
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Kullanıcıyı appointment sayfasına yönlendir
                    window.location.href = 'pages/appointment.html';
                } else {
                    alert(data.message || "Giriş yapılamadı");
                }
		})
		.catch(err => {
			console.error("Fetch hatası:", err);
			alert("Bağlantı hatası oluştu");
		});
	});	
}
else if(currentPage === 'register.html'){
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
}
else if(currentPage==='appointment.html')
{
	const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.name) {
            userNameElement.textContent = `Hoş geldiniz, ${user.name}`;
        }
    }
	const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Local storage'dan token ve kullanıcı bilgilerini temizle
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Kullanıcıyı login sayfasına yönlendir
            alert("Başarıyla çıkış yapıldı!");
            
            // Sayfanın konumuna göre doğru yönlendirme yap
            const currentPath = window.location.pathname;
            if (currentPath.includes('/pages/')) {
                window.location.href = '../index.html';
            } else {
                window.location.href = 'index.html';
            }
        });
	}
}
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
function checkAuthStatus(){
	const token= localStorage.getItem('token');

	const currentPage = window.location.pathname.split('/').pop();
	console.log(currentPage);
	if(token){
		if(currentPage === 'index.html' || currentPage === '' || currentPage === '/'){
			window.location.href = 'pages/appointment.html';
		}
		else if(currentPage=== 'register.html'){
			window.location.href = 'appointment.html';
		}
	}
	else{
		if (currentPage === 'appointment.html') {
			window.location.href = '../index.html';
		}
	}
}
checkAuthStatus();
