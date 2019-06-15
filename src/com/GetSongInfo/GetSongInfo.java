package com.GetSongInfo;

import java.io.IOException;
import java.util.List;

public abstract class GetSongInfo {
    abstract public List getSongList(String keyword, String page_num, String ua, boolean if_recommend) throws IOException;

    abstract public String getTotal_page_num();
}
