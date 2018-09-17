package com.esen.study.thread;

import java.util.concurrent.ConcurrentLinkedQueue;

public class TaskRunnable implements Runnable {

	private ConcurrentLinkedQueue<MetaData> queue;

	private boolean isRunning = true;

	private String name;

	private int i = 1;

	public TaskRunnable(ConcurrentLinkedQueue<MetaData> queue, String name) {
		this.queue = queue;
		this.name = name;
	}

	public void run() {
		while (this.isRunning || !this.queue.isEmpty()) {
			MetaData metadata = this.queue.poll();
			try {
				if (null == metadata) {
					continue;
				}
				Thread.sleep(200); // 实际做具体检核操作，这里延时模拟
				System.out.println(this.name + "\t" + metadata.getCode() + (i++));
			} catch (Exception e) {
				e.printStackTrace();
			}

		}
	}

	public void stop() {
		this.isRunning = false;
		System.err.println("停止" + this.name);
	}
}
