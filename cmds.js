const {log, biglog, errorlog, colorize} = require("./out");

const model = require('./model');

exports.helpCmd = rl => {
    log("Commandos");
    log("   h|help - muestra esta ayuda.");
    log("   list - Listar los quizzes existentes.");
    log("   show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log("   add - Añadir un nuevo quiz interactivamente.");
    log("   delete <id> - Borrar el quiz indicado.");
    log("   edit <id> - Editar el quiz indicado.");
    log("   test <id> - Probar el quiz indicado.");
    log("   p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("   credits - Créditos..");
    log("   q|quit - Salir del programa.");
	rl.prompt();
}

exports.quitCmd = rl => {
    rl.close();
}

exports.addCmd = rl => {
    rl.question(colorize(' Introduzca la pregunta: ', 'red'), question => {
		rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {
			model.add(question,answer);
			log(` ${colorize('Se ha añadido','magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
			rl.prompt();
		});
	});
};

exports.listCmd = rl => {
	model.getAll().forEach((quiz, id) => {
		log(`[${colorize(id, 'magenta')}]: ${quiz.question}`);
	});
	rl.prompt();
}

exports.showCmd = (rl,id) => {
    if(typeof id === "undefined"){
		errorlog(`falta el parametro id.`);
	} else {
		try{
			const quiz = model.getByIndex(id);
			log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
		} catch(error) {
			errorlog(error.message);
		}
	}
	rl.prompt();
}

exports.testCmd = (rl,id) => {
    if(typeof id === "undefined"){
		errorlog(`falta el parametro id.`);
		rl.prompt();
	} else{
		try{
			const quiz = model.getByIndex(id);
			rl.question(`${colorize(quiz.question + ' ','red')}`, answer => {
					if(quiz.answer.toUpperCase() === answer.toUpperCase().trim()){
						log("Su respuesta es correcta");
						biglog('Correcta', 'green');
					} else{
						log("Su respuesta es incorrecta");
						biglog('Incorrecta', 'red');
					}
					rl.prompt();
			});
		} catch(error) {
			errorlog(error.message);
			rl.prompt();
		}
	}
}

exports.playCmd = (rl) => {
    let score = 0;
	let toBeResolved = [];
	for(i=0;i<model.getAll().length;i++){
		toBeResolved[i]=i;
	}
	//console.log("tiene que salir");
	const playOne = () => {		
		//console.log("tiene que salir tambien");
		if(toBeResolved.length === 0){
			console.log("No hay nada mas que preguntar.\nFin del examen. Aciertos:");
			biglog(score,'magenta');
			rl.prompt();
			return;			
		} else {
			let id = Math.floor(Math.random()*toBeResolved.length);
			id2=toBeResolved[id];
			toBeResolved.splice(id,1);
			let quiz = model.getByIndex(id2);
			rl.question(colorize(quiz.question + ' ','red'), resp => {
				if(resp === quiz.answer){
					score++;
					console.log('CORRECTO - Lleva ',score, 'aciertos');
					playOne();
					rl.prompt();
					return;
				} else{
					console.log('INCORRECTO.\nFin del examen. Aciertos:');
					biglog(score,'magenta');
					rl.prompt();
					return;
				}
			});
		}
		
	}
	rl.prompt();
	playOne();				
			
};

exports.deleteCmd = (rl,id) => {
    if( typeof id === "undefined"){
		errorlog(`Falta el parametro id.`)
	} else {
		try{
			model.deleteByIndex(id);
		} catch(error) {
			errorlog(error.message);
		}
	}
	rl.prompt();
}

exports.editCmd = (rl,id) => {
    if (typeof id === "undefined"){
		errorlog(`Falta el parametro id.`);
		rl.prompt
	} else {
		try{
			const quiz = model.getByIndex(id);
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
			rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
				rl.question(colorize(' Introduzca una respuesta ','red'), answer => {
					model.update(id,question,answer);
					log(`Se ha cambiado el quiz ${colorize(id,'magenta')} por: ${question} ${colorize('=>','magenta')} ${answer}`);
					rl.prompt();
				});
			});
		} catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}
};

exports.creditsCmd = (rl) => {
    log('Autores de la practica:');
    log('ALVARO','green');
	rl.prompt();
}