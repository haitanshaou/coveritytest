package com.esen.study.designmode.state;

public class Client {
	public static void main(String[] args) {
		Context context = new Context(new StateA());
		context.request();
		context.request();
		context.request();
	}
}
