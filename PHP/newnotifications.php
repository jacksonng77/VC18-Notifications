<?PHP
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header("Content-Type: application/json; charset=UTF-8");

	include("global.php");
	function sendMessage($email, $message, $sender, $arrayfull){
		$content = array(
			"en" => $message
		);
		
		$fields = array(
			'app_id' => global_app_id,
			'filters' => $arrayfull,
			'data' => array("sender" => $sender),
			'contents' => $content
		);
		
		$fields = json_encode($fields);
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8','Authorization: Basic '.global_rest_id));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		curl_setopt($ch, CURLOPT_POST, TRUE);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

		$response = curl_exec($ch);
		curl_close($ch);
		
		return $response;
	}

	$email = $_GET['emails'];
	$message = $_GET['message'];
    $sender = $_GET['sender'];    
	$arrayfull = [];

	$arrayhead = array("field" => "tag", "key" => "email", "relation" => "=");
	$emailArray = explode(',', $email);

	if (count($emailArray) == 1) {
		$arrNew = array('value' => $emailArray[0]);
		$arrayhead = $arrayhead + $arrNew;
		array_push($arrayfull, $arrayhead);
	}
	else {
		foreach ($emailArray as &$value) {
			$arrOr = array('operator' => 'OR');
			$arrNew = $arrayhead + array("value" => $value);
			array_push($arrayfull, $arrayNew);
			array_push($arrayfull, $arrOr);
		}
	}

	$response = sendMessage($email, $message, $sender, $arrayfull);
	$return["allresponses"] = $response;
	$return = json_encode( $return);

	//find the end of the recipient string in the response
	$pos = strpos($return, '\"recipients\":');
	$posend = $pos + 15;

	$lastchunk = substr($return, $posend, strlen($return)-$posend+1);
	$commapos = strpos($lastchunk, ",");
	$bracketpos = strpos($lastchunk, "}");

	if ($commapos != null){
		$num = substr($lastchunk, 0, $commapos);
	}
	else {
		$num = substr($lastchunk, 0, $bracketpos);
	}

	$json_out = "[" . json_encode(array("result"=>(int)$num)) . "]";
	echo $json_out;
?>