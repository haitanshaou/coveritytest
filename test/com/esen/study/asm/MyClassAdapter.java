package com.esen.study.asm;

import org.ow2.jonas.asm.ClassAdapter;
import org.ow2.jonas.asm.ClassVisitor;
import org.ow2.jonas.asm.MethodAdapter;
import org.ow2.jonas.asm.MethodVisitor;
import org.ow2.jonas.asm.Opcodes;
import org.ow2.jonas.asm.Type;

public class MyClassAdapter extends ClassAdapter {

	public MyClassAdapter(ClassVisitor cv) {
		super(cv);
	}

	@Override
	public MethodVisitor visitMethod(int access, String name, String desc, String signature, String[] exceptions) {
		MethodVisitor methodVisitor = cv.visitMethod(access, name, desc, signature, exceptions);
		if (name.equals("<init>")) {
			return new InitMethodAdapter(methodVisitor);
		} else if (name.equals("setName")) {
			return new SetMethodAdapter(methodVisitor);
		} else if (name.equals("getName")) {
			return new GetMethodAdapter(methodVisitor);
		} else {
			return super.visitMethod(access, name, desc, signature, exceptions);
		}
	}

	//这个类生成具体的构造方法字节码  
	class InitMethodAdapter extends MethodAdapter {
		public InitMethodAdapter(MethodVisitor mv) {
			super(mv);
		}

		@Override
		public void visitCode() {
			mv.visitVarInsn(Opcodes.ALOAD, 0);
			mv.visitMethodInsn(Opcodes.INVOKESPECIAL, Type.getInternalName(Object.class), "<init>", "()V");//调用父类的构造方法  
			mv.visitVarInsn(Opcodes.ALOAD, 0);
			mv.visitLdcInsn("Kuzury");//将常量池中的字符串常量加载到栈顶  
			mv.visitFieldInsn(Opcodes.PUTFIELD, Type.getInternalName(MyClass.class), "name",
					Type.getDescriptor(String.class));//对name属性赋值  
			mv.visitInsn(Opcodes.RETURN);//设置返回值  
			mv.visitMaxs(2, 1);//设置方法的栈和本地变量表的大小  
		}
	};

	//这个类生成具体的setName方法字节码    
	class SetMethodAdapter extends MethodAdapter {
		public SetMethodAdapter(MethodVisitor mv) {
			super(mv);
		}

		@Override
		public void visitCode() {
			mv.visitVarInsn(Opcodes.ALOAD, 0);
			mv.visitVarInsn(Opcodes.ALOAD, 1);
			mv.visitFieldInsn(Opcodes.PUTFIELD, Type.getInternalName(MyClass.class), "name",
					Type.getDescriptor(String.class));
			mv.visitInsn(Opcodes.RETURN);
			mv.visitMaxs(2, 2);
		}

	}

	//这个类生成具体的getName方法字节  
	class GetMethodAdapter extends MethodAdapter {

		public GetMethodAdapter(MethodVisitor mv) {
			super(mv);
		}

		@Override
		public void visitCode() {
			mv.visitVarInsn(Opcodes.ALOAD, 0);
			mv.visitFieldInsn(Opcodes.GETFIELD, Type.getInternalName(MyClass.class), "name",
					Type.getDescriptor(String.class));//获取name属性的值  
			mv.visitInsn(Opcodes.ARETURN);//返回一个引用，这里是String的引用即name  
			mv.visitMaxs(1, 1);
		}
	}
}