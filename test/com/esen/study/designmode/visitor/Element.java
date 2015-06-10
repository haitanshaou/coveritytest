package com.esen.study.designmode.visitor;

abstract class Element {
	public abstract void accept(IVisitor visitor);

	public abstract void doSomething();
}