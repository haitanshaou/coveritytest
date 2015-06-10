package com.esen.study.designmode.visitor;

interface IVisitor {
	public void visit(ConcreteElement1 el1);

	public void visit(ConcreteElement2 el2);
}
