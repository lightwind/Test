function dbNumberToShowNumber(dbNumber, totalLockNumberOfLocker) {   //String dbNumber, int totalLockNumberOfLocker
		
	var result = null;								//String
	var dbNumberHeader = dbNumber.charAt(0);	//char
	
	//int A, B, C, Bt1, Ct1
	var A = -1;
	var B = -1;
	var C = -1;
	
	var Bt1 = -1;
	var Ct1 = -1;
	
	var resultInt = -1;
	
	if(totalLockNumberOfLocker <= 34) {
		
		A = 16;
		B = totalLockNumberOfLocker - 16;
		
		if(dbNumberHeader == 'B') {
			
			resultInt = parseInt(dbNumber.substring(1));
			
		}else {
			
			resultInt = (parseInt(dbNumber.substring(1)) + B);
			
		}
		
	}else if(totalLockNumberOfLocker <= 52 && totalLockNumberOfLocker > 34) {
		
		if(totalLockNumberOfLocker % 2 == 0) {
			
			A = 16;

		}else {
			
			A = 15;
			
		}
		B = (totalLockNumberOfLocker - A) / 2;
		C = B;
		
		switch(dbNumberHeader) {
		
		case 'B':
			resultInt = parseInt(dbNumber.substring(1));
			break;
			
		case 'A':
			resultInt = (parseInt(dbNumber.substring(1)) + B);
			break;
			
		case 'C':
			resultInt = (parseInt(dbNumber.substring(1)) + B + A);
			break;
		
		}

	}else if(totalLockNumberOfLocker > 52) {
		
		if(totalLockNumberOfLocker % 2 == 0) {
			
			A = 16;
			B = 18;
			Bt1 = (totalLockNumberOfLocker - 52) / 2;

		}else {
			
			A = 15;
			B = 18;
			Bt1 = (totalLockNumberOfLocker - 51) / 2;
			
		}
		C = B;
		Ct1 = Bt1;

		var tempNum = parseInt(dbNumber.substring(1));
		
		switch(dbNumberHeader) {
		
		case 'B':
			if(tempNum <= 18) {
				
				resultInt = parseInt(dbNumber.substring(1));
				
			}else {
				
				resultInt = (tempNum - 18 + A + B * 2);
				
			}
			break;
			
		case 'A':
			resultInt = (parseInt(dbNumber.substring(1)) + B);
			break;
			
		case 'C':
			if(tempNum <= 18) {
				
				resultInt = (parseInt(dbNumber.substring(1)) + B + A);
				
			}else {
				
				resultInt = (tempNum - 18 + A + B * 2 + Bt1);
				
			}
			break;
		
		}
		
	}
	
	if(resultInt < 10){
		
		result = "A0" + resultInt;
		
	}else{
		
		result = "A" + resultInt;
	
	}
	
	return result;
	
}

function showNumberToDBNumber(showNumber, totalLockNumberOfLocker) {  //String showNumber, int totalLockNumberOfLocker
	
	var result = null;								//String
	var showNumberInt = parseInt(showNumber);	//int
	var tempNumber = -1;								//int
	
	//int A, B, C, Bt1, Ct1
	var A = -1;
	var B = -1;
	var C = -1;
	var Bt1 = -1;
	var Ct1 = -1;
	
	if(showNumberInt > totalLockNumberOfLocker){
		
		return "ERROR";
		
	}
	
	if(totalLockNumberOfLocker <= 34) {
		
		A = 16;
		B = totalLockNumberOfLocker - A;
		
	}else if(totalLockNumberOfLocker > 34 && totalLockNumberOfLocker <= 52){
		
		if(totalLockNumberOfLocker % 2 == 0) {
			
			A = 16;

		}else {
			
			A = 15;
			
		}
		B = (totalLockNumberOfLocker - A) / 2;
		C = B;

	}else {
		
		if(totalLockNumberOfLocker % 2 == 0) {
			
			A = 16;

		}else {
			
			A = 15;
			
		}
		B = 18;
		C = B;
		Bt1 = (totalLockNumberOfLocker - 52) / 2;
		Ct1 = Bt1;
		
	}
	
	if(showNumberInt <= B) {
		
		if(showNumberInt < 10) {
			
			result = "B0" + showNumberInt;
			
		}else {
			
			result = "B" + showNumberInt;

		}
		
	}else if(showNumberInt > B && showNumberInt <= B + A) {
		
		tempNumber = showNumberInt - B; 
		
		if(tempNumber < 10) {
			
			result = "A0" + tempNumber;
			
		}else {
			
			result = "A" + tempNumber;
			
		}
		
	}else if(showNumberInt > B + A && showNumberInt <= 52) {
		
		tempNumber = showNumberInt - B - A; 
		
		if(tempNumber < 10) {
			
			result = "C0" + tempNumber;
			
		}else {
			
			result = "C" + tempNumber;
			
		}

	}else {
		
		if(showNumberInt > 52 && showNumberInt <= 52 + Bt1) {
			
			tempNumber = showNumberInt - 52; 
			result = "B" + (tempNumber + 18);

		}else {
			
			tempNumber = showNumberInt - 52 - Bt1;
			result = "C" + (tempNumber + 18);
			
		}
		
		
	}
	return result;
	
}