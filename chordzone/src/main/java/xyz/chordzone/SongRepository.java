package xyz.chordzone;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long>{

    @Query("SELECT f FROM Song f WHERE LOWER(f.singer) = LOWER(:singer)")
    List<Song> retrieveByTitle(@Param("singer") String singer);

    @Query(value = "SELECT * FROM song limit :startRow, :numOfRow", nativeQuery = true)
    List<Song> get10Results(int startRow, int numOfRow);

    @Query("SELECT s FROM Song s ORDER BY (s.postdate) DESC")
    Song retrieve10Newest(@Param("singer") String singer);

    @Query(value = "SELECT COUNT(*) FROM song", nativeQuery = true)
    Long getTotalRows();

    @Query(value = "SELECT * FROM song ORDER BY visitcount DESC LIMIT 10", nativeQuery = true)
    List<Song> getTop10();
}
