(function () {
	Handlebars.registerHelper('for', function(items, options) {
		var out = '';
	  for(var i=0, l=items.length; i<l; i++) {
	    out += options.fn(items[i]);
	  }
	  return out
	});
})();

(function () {
	function compile(name,data) {
		return Handlebars.compile($('#'+name).html())(data);
	}
	var chat = {
		_users : {},
		get users (){
			return this._users;
		},
		set users (value){
			delete value[this.currentUser.id];
			this._users = value;
			this.paintListUsers();
		},
		paintListUsers : function () {
			var users = [];
			for(var index in this.users){
				users.push({content : compile('users-template',{name : this.users[index]}) });
			}
			$('#user-list').html(compile('list-users-template',{users : users}));
		}
	};

	var	modalLogin,
			nameLogin,
			formLogin;

	window.onload = function () {
		modalLogin = document.getElementById('modal-login');
		nameLogin = document.getElementById('nameLogin');
		formLogin = document.getElementById('login');

		$(modalLogin).openModal({
			dismissible : false
		});

		initSocket();


		formLogin.addEventListener('submit',function (evt) {
			evt.preventDefault();
			if(nameLogin.value == ''){
				Materialize.toast('Bad nickname', 4000);
				return false;
			}
			socket.emit('login',nameLogin.value);
		});
	};


	function initSocket() {
		window.socket = io.connect();

		socket.on('welcome',function (user) {
			if(!user) return;
			chat.currentUser = user;
			$(modalLogin).closeModal();
			Materialize.toast('Welcome ' + user.name, 4000);
		});

		socket.on('updateUsers',function 	(userList) {
			updateUsers(userList);
		});

	}

	function updateUsers(userList) {
		chat.users = userList;
		console.log('updateUsers',chat.users);
	}

	window.chat;
})();
