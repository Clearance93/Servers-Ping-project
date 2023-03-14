package com.example.demo.services;

import com.example.demo.model.Server;

import java.io.IOException;
import java.util.Collection;

public interface ServerServices {
    Server create(Server server);
    Server ping(String ipAddress) throws IOException;
    Collection<Server> list(int limit);
    Server get(Long id);
    Server update(Server server);
    Boolean delete(Long id);
}
