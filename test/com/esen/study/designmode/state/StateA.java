package com.esen.study.designmode.state;

public class StateA implements State {

	public void handel(Context context) {
		System.out.println("现在是状态A，A的下一个状态是B");
		context.setState(new StateB());
	}

}
