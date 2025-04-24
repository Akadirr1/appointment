document.querySelector('.signbtn').addEventListener('click',()=>{
	const sname = document.getElementById('inputName').value;
	const semail = document.getElementById('signmail').value;
	const spassword = document.getElementById('signpassword').value;
	console.log("name = ",sname);
	console.log("email = ",semail);
	console.log("password = ",spassword);

	fetch('http://localhost:3000/register',{
		method:'post',
		headers:{
			 'Content-Type': 'application/json'
		},
		body: JSON.stringify({ sname, semail, spassword })
	})
	.then(res => res.text())
	.then(data => alert(data));
});

document.querySelector('.loginbtn').addEventListener('click',()=>{
	const lmail = document.getElementById('loginmail').value;
	const lpassword = document.getElementById('loginpassword').value;
	fetch('http://localhost:3000/login',{
		method: 'post',
		headers :{
			'Content-Type': 'application/json'
	   },
	   body : JSON.stringify({lmail, lpassword})
	})
	.then(res => res.text())
	.then(data => alert(data));
});

//document.getElementById('bookbtn').addEventListener('click',()=>{
//	const selectElement = document.querySelector('.bookservice');
//	const bookservice = selectElement.options[selectElement.selectedIndex].text;
//	const bookdate = document.getElementById('bookdate').value;
//	const booktime = document.getElementById('booktime').value;
//	console.log(bookservice);
//	console.log(bookdate);
//	console.log(booktime);
//	fetch(('http://localhost:3000/book'),{
//		method : 'post',
//		headers:{'Content-Type': 'application/json'},
//		body : JSON.stringify({bookservice, bookdate, booktime})
//	})
//	.then(res => res.text())
//	.then(data => alert(data));
//});