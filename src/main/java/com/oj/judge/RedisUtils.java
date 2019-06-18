package com.oj.judge;


import com.oj.entity.practic.TestData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.Pipeline;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * redis的工具类，负责连接，调用命令，并把连接返还到池中
 */
@Component
public class RedisUtils {

    @Autowired
    private JedisPool redisPoolFactory;

    private final int EXPIRE = 60*60*24*30;


    /**
     * 从redis获取该题目的测试样例
     * @param problemId
     * @return
     */
    public Map<Integer, List<String>> getTestData(int problemId) {
        Jedis jedis = null;
        Map<Integer, List<String>> data = null;
        try {
            jedis = redisPoolFactory.getResource();
            if (jedis.exists(Constants.RedisPrefix.PID_DATA + problemId)) {
                data = new HashMap<>();
                List<String> pidData=jedis.lrange(Constants.RedisPrefix.PID_DATA + problemId, 0, -1);
                for(String id:pidData){
                    List<String> io=new ArrayList<>();
                    Map<String, String> map=jedis.hgetAll(Constants.RedisPrefix.DATA_ID + id);
                    io.add(map.get(Constants.RedisPrefix.IN));
                    io.add(map.get(Constants.RedisPrefix.OUT));
                    data.put(Integer.valueOf(id), io);
                }
            }
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }
        return data;
    }

    /**
     * 没命中缓存时，需要从list中将数据写入redis中。
     * @param list
     * @return
     */
    public Map<Integer, List<String>> writeToRedisAndGetTestData(List<TestData> list, int problemId) {
        Jedis jedis = redisPoolFactory.getResource();
        Pipeline pipe = jedis.pipelined();
        Map<Integer, List<String>> data = new HashMap<>();
        for (TestData testData : list) {
            List<String> io = new ArrayList<>(4);
            Map<String, String> map = new HashMap<>(4);
            String in = testData.getInput();
            String out = testData.getOutput();
            int id = testData.getId();
            io.add(in);
            io.add(out);
            map.put(Constants.RedisPrefix.IN, in);
            map.put(Constants.RedisPrefix.OUT, out);
            data.put(id, io);
            pipe.lpush(Constants.RedisPrefix.PID_DATA + problemId,String.valueOf(id));
            pipe.hmset(Constants.RedisPrefix.DATA_ID + id, map);
            pipe.expire(Constants.RedisPrefix.DATA_ID + id, EXPIRE);
        }
        pipe.expire(Constants.RedisPrefix.PID_DATA + problemId, EXPIRE);
        pipe.sync();
        jedis.close();
        return data;
    }
}
