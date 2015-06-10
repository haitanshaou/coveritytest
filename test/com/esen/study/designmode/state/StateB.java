package com.esen.study.designmode.state;

public class StateB implements State {

	public void handel(Context context) {
		System.out.println("现在是状态B，B的下一个状态是C");
		context.setState(new StateC());
	}

}
