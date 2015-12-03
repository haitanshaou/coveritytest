package com.esen.study.map;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.junit.Test;

/**
 * 假如容器里有多把锁，每一把锁用于锁容器其中一部分数据，
 * 那么当多线程访问容器里不同数据段的数据时，线程间就不会存在锁竞争，
 * 从而可以有效的提高并发访问效率，这就是ConcurrentHashMap所使用的锁分段技术，
 * 首先将数据分成一段一段的存储，然后给每一段数据配一把锁，
 * 当一个线程占用锁访问其中一个段数据的时候，其他段的数据也能被其他线程访问。
 * @author chenlan
 */
public class TestConcurrentHashMap {
	private static ConcurrentHashMap<Integer, Integer> map = new ConcurrentHashMap<Integer, Integer>();
	private static ConcurrentHashMap<String, String> threadsafemap = new ConcurrentHashMap<String, String>();

	@Test
	public void testthread() throws InterruptedException {
		Thread t = new Thread(new Runnable() {
			public void run() {
				for (int i = 0; i < 1000; i++) {
					new Thread(new Runnable() {
						public void run() {
							threadsafemap.put(UUID.randomUUID().toString(), "");
						}
					}, "ftf" + i).start();
				}
			}
		}, "ftf");
		t.start();
		t.join();
		System.out.println(threadsafemap);
	}

	@Test
	public void test() {
		new Thread("Thread1") {
			@Override
			public void run() {
				map.put(3, 33);
			}
		}.run();

		new Thread("Thread2") {
			@Override
			public void run() {
				map.put(4, 44);
			}
		}.run();

		new Thread("Thread3") {
			@Override
			public void run() {
				map.put(7, 77);
			}
		}.run();
		System.out.println(map);
	}
}
