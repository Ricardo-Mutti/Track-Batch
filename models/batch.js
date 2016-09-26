module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var batchSchema = new Schema({

		productName: String,
		POID: Schema.Types.ObjectId,
		fabDate: Date,
		qnt: String,
		firstMachine: String,
		currentMachine: { type: String, default: 'none' },
		activitiesTime: [String],//São os eventos, da com eles extrair no front o tempo das atividades e o tempo de transporte
		batchStatus: { type: String, default: 'onHold' } //onHold, ready, started, finished. (started = time between ready and first RFID read)
		
	});

	return mongoose.model('Batch', batchSchema);
}

//Da pra tirar a duração no front com o activities time, mas como essa conta vai ser feita pra popular o product ETC
//Do product vai vir as atividades tmb