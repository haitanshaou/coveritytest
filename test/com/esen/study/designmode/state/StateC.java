package com.esen.study.designmode.state;

public class StateC implements State {

	public void handel(Context context) {
		System.out.println("现在是状态C，C的下一个状态是A");
		context.setState(new StateA());
	}

}
