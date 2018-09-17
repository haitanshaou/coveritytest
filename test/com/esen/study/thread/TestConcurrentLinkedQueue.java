package com.esen.study.thread;

import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.junit.Test;

/**
 * 试3个线程池处理，用ConcurrentLinkedQueue
 * （元数据组合关系检核）
 * @author chenlan
 * @since 2018-09-15
 */
public class TestConcurrentLinkedQueue {

	private static ConcurrentLinkedQueue<MetaData> queue1 = new ConcurrentLinkedQueue<MetaData>();

	private static ConcurrentLinkedQueue<MetaData> queue2 = new ConcurrentLinkedQueue<MetaData>();

	private static ConcurrentLinkedQueue<MetaData> queue3 = new ConcurrentLinkedQueue<MetaData>();

	private static TaskRunnable run1 = new TaskRunnable(queue1, "task1");

	private static TaskRunnable run2 = new TaskRunnable(queue2, "task2");

	private static TaskRunnable run3 = new TaskRunnable(queue3, "task3");

	public static void main(String[] args) {
		ExecutorService pool = Executors.newFixedThreadPool(3);
		pool.submit(run1);
		pool.submit(run2);
		pool.submit(run3);
		for (int i = 0; i < 1000; i++) {
			int mod = i % 3;
			if (mod == 0) {
				queue1.offer(new MetaData());
			} else if (mod == 1) {
				queue2.offer(new MetaData());
			} else if (mod == 2) {
				queue3.offer(new MetaData());
			}
		}
		// XXX finally 里面放，必须stop掉
		System.out.println(queue1.size() + "\t" + queue2.size() + "\t" + queue3.size());
		run1.stop();
		run2.stop();
		run3.stop();
		pool.shutdown();
	}
}
