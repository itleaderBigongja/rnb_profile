package com.rnb.profile.profile.domain.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@ToString
public class ProjectHstPkClass implements Serializable {

    private String id;              // ProjectHst 엔티티의 id 필드와 이름이 같아야 한다.
    private String prjSeqNo;        // ProjectHst 엔티티의 prjSeqNo 필드와 이름이 같아야 한다.

    // 기본 생성자
    public ProjectHstPkClass() {}

    // 필드 생성자
    public ProjectHstPkClass(String id, String prjSeqNo) {
        this.id = id;
        this.prjSeqNo = prjSeqNo;
    }

    // equals()와 hashCode() 구현
    @Override
    public boolean equals(Object o) {
        if( this == o ) { return true; }
        if( o == null || getClass() != o.getClass()) { return false; }

        ProjectHstPkClass that = (ProjectHstPkClass) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(prjSeqNo, that.prjSeqNo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, prjSeqNo);
    }
}
