"""Response caching for AI queries to reduce API calls and token usage"""
import hashlib
import time
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)


class QueryCache:
    """LRU cache for AI query responses with TTL"""
    
    def __init__(self, max_size: int = 100, ttl_seconds: int = 3600):
        self.max_size = max_size
        self.ttl_seconds = ttl_seconds
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.hits = 0
        self.misses = 0
    
    def _generate_key(self, query: str, agent_name: str) -> str:
        """Generate cache key from query and agent"""
        content = f"{agent_name}:{query.lower().strip()}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def get(self, query: str, agent_name: str) -> Optional[Dict[str, Any]]:
        """Get cached response if exists and not expired"""
        key = self._generate_key(query, agent_name)
        
        if key in self.cache:
            cached = self.cache[key]
            age = time.time() - cached["timestamp"]
            
            if age < self.ttl_seconds:
                self.hits += 1
                logger.info(
                    f"[CACHE HIT] Agent: {agent_name}, Age: {age:.1f}s, Hit rate: {self.get_hit_rate():.1%}"
                )
                return cached["response"]
            else:
                # Expired, remove
                del self.cache[key]
                logger.debug(f"[CACHE EXPIRED] Agent: {agent_name}, Age: {age:.1f}s")
        
        self.misses += 1
        return None
    
    def set(self, query: str, agent_name: str, response: Dict[str, Any]):
        """Cache a response"""
        key = self._generate_key(query, agent_name)
        
        # Evict oldest if at capacity
        if len(self.cache) >= self.max_size:
            oldest = min(self.cache.items(), key=lambda x: x[1]["timestamp"])
            del self.cache[oldest[0]]
            logger.debug(f"[CACHE EVICT] Evicted oldest entry, cache size: {len(self.cache)}")
        
        self.cache[key] = {
            "response": response.copy(),  # Deep copy to prevent mutations
            "timestamp": time.time()
        }
        logger.debug(f"[CACHE SET] Agent: {agent_name}, Cache size: {len(self.cache)}")
    
    def clear(self):
        """Clear all cache"""
        self.cache.clear()
        self.hits = 0
        self.misses = 0
        logger.info("[CACHE CLEAR] Cache cleared")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total_requests = self.hits + self.misses
        return {
            "cache_size": len(self.cache),
            "cache_hits": self.hits,
            "cache_misses": self.misses,
            "hit_rate": self.get_hit_rate(),
            "total_requests": total_requests,
            "max_size": self.max_size,
            "ttl_seconds": self.ttl_seconds
        }
    
    def get_hit_rate(self) -> float:
        """Calculate cache hit rate"""
        total = self.hits + self.misses
        return self.hits / total if total > 0 else 0.0


# Global cache instance
query_cache = QueryCache(max_size=100, ttl_seconds=3600)  # 1 hour TTL
