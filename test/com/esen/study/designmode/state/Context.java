package com.esen.study.designmode.state;

/**
 * 维护一个状态子类的实例，这个实例定义当前的状态
 * @author chenlan
 */
public class Context {
	private State state;

	public Context(State state) {
		this.state = state;
	}

	public State getState() {
		return state;
	}

	public void setState(State state) {
		this.state = state;
	}
	
	public void request() {
		this.state.handel(this);
	}
}
