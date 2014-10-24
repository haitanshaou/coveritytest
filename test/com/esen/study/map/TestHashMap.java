package com.esen.study.map;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;

/**
 * hashMap put的时候，会去查对象的hashcode
 * 
 * Object hashCode默认实现：
 * 无论何时调用不止一次在对同一对象的Java应用程序的执行,
 * hashCode方法必须始终返回相同的整数,没有提供信息用于等于比较对象被修改。
 * 这个整数不需要保持一致从一个执行应用程序的另一个相同的应用程序的执行。
 * 
 * 问题：HashMap的key是一个对象，如果修改了这个对象的属性，是否还能根据这个对象get到value
 * 结论：这与对象的hashCode实现有关,
 * 				如果是默认Object的实现,是能get到的;
 * 				如果重写了hashCode的实现,要看修改了属性后hashCode的值是否有改变,若有改变则不能get到
 * 				(如果2个不同的对象,hashCode的值是一样的,能分别get的到对应的value)
 */
public class TestHashMap {

	/**
	 * 测试：
	 * 	hashmap 的key 是一个对象，StuObj没有重写Object的hashCode实现，修改该对象的属性值
	 * 结果：
	 * 	能get到这个对象
	 */
	@Test
	public void testKeyObj1() {
		Map<Object, String> map = new HashMap<Object, String>();

		StuObj stu1 = new StuObj("1", "htso", false);
		map.put(stu1, "this is htso");

		stu1.setId("3");
		System.out.println(map.get(stu1));//	this is htso
	}

	/**
	 * 测试：
	 * 	重写TeacherObj的hashCode实现，永远返回1，hashmap put2个不同的对象，
	 * 结果:
	 * 	依旧能分别get到这2个不同的对象
	 * (hash表存在冲突解决方案,hash一样的话，以链表的方式解决冲突)
	 */
	@Test
	public void testKeyObj2() {
		Map<Object, String> map = new HashMap<Object, String>();

		TeacherObj to1 = new TeacherObj("to1", "to1");
		TeacherObj to2 = new TeacherObj("to2", "to2");

		System.out.println(to1.equals(to2));//	false
		map.put(to1, "this is to1");
		map.put(to2, "this is to2");

		System.out.println(map.get(to1)); //　this is to1
		System.out.println(map.get(to2)); //	this is to2

	}

	/**
	 * 测试：
	 * 	重写catObj的hashCode实现，该实现与name和attribute属性有关，修改该对象的name属性值
	 * 结果:
	 * 	不能get到这个对象
	 */
	@Test
	public void testKeyObj3() {
		Map<Object, String> map = new HashMap<Object, String>();

		catObj co1 = new catObj(1, "red hair,blue eyes", "ca1");
		map.put(co1, "this is ca1");
		co1.setName("ca2");

		System.out.println(map.get(co1)); //	null

	}

	class catObj {
		private int id;

		private String attribute;

		private String name;

		public catObj(int id, String attribute, String name) {
			super();
			this.id = id;
			this.attribute = attribute;
			this.name = name;
		}

		public void setName(String name) {
			this.name = name;
		}

		@Override
		public int hashCode() {
			return name.hashCode() + attribute.hashCode();
		}
	}

	class TeacherObj {
		private String id;

		private String name;

		public TeacherObj(String id, String name) {
			super();
			this.id = id;
			this.name = name;
		}

		@Override
		public int hashCode() {
			return 1;
		}
	}

	class StuObj {
		private String id;// 编号

		private String name;// 姓名

		private boolean isMale;// 是否是男性

		public StuObj(String id, String name, boolean isMale) {
			super();
			this.id = id;
			this.name = name;
			this.isMale = isMale;
		}

		public void setId(String id) {
			this.id = id;
		}
	}
}
