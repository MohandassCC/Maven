package com.cc.setup.util;

import java.security.Key;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder; 

/**
 * @author Sakthi King
 *  Password Encryption and Decryption on 26-03-2014
 */
@SuppressWarnings("restriction")
public class PasswordEncryptorDecryptorAES {
	private static final String ALGORITHMUSEDFORENCRPTIONDECRYPTION = "AES";
	private static final byte[] UNIQUE_KEYS = new byte[] { 'C', 'C', 'A', 'D', 'M', 'I', 'N', 'P', 'A', 'S', 'S', 'W', 'O', 'R', 'D', 'S' };

	private static Key generateKey() throws Exception {
		Key key = new SecretKeySpec(UNIQUE_KEYS, ALGORITHMUSEDFORENCRPTIONDECRYPTION);
		return key;
	}

	/** This method is used for Password Encryption using AES algorithm */
	public static String doPasswordEncryption(String plainString4Encyption) throws Exception {
		Key key = generateKey();
		Cipher c = Cipher.getInstance(ALGORITHMUSEDFORENCRPTIONDECRYPTION);
		c.init(Cipher.ENCRYPT_MODE, key);
		byte[] encyptedArrayValue = c.doFinal(plainString4Encyption.getBytes());
		String encryptedStringValue = new BASE64Encoder().encode(encyptedArrayValue);
		return encryptedStringValue;
	}

	/** This method is used for Password decryption using AES algorithm */
	public static String getDecryptedPassword(String encryptedString) throws Exception {
		Key key = generateKey();
		Cipher c = Cipher.getInstance(ALGORITHMUSEDFORENCRPTIONDECRYPTION);
		c.init(Cipher.DECRYPT_MODE, key);
		byte[] decodedArrayValue = new BASE64Decoder().decodeBuffer(encryptedString);
		byte[] decyptedArrayValue = c.doFinal(decodedArrayValue);
		String decryptedStringValue = new String(decyptedArrayValue);
		return decryptedStringValue;
		
	}

}
