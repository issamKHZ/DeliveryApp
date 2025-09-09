using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using profiles.Models;

namespace profiles.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Collection_Item> Collection_Items { get; set; }

    public virtual DbSet<Collections_Type> Collections_Types { get; set; }

    public virtual DbSet<DB_File> DB_Files { get; set; }

    public virtual DbSet<Entreprise> Entreprises { get; set; }

    public virtual DbSet<Horaire> Horaires { get; set; }

    public virtual DbSet<Livreur> Livreurs { get; set; }

    public virtual DbSet<Responsable> Responsables { get; set; }

    public virtual DbSet<UserStatus> UserStatuses { get; set; }

    public virtual DbSet<Vehicle> Vehicles { get; set; }

//     protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
// #warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//         => optionsBuilder.UseSqlServer("Server=ISSAM20\\SQLEXPRESS;Database=DeliveryDB_PROFIL;User Id=sa;Password=Aqwxsz@1234;TrustServerCertificate=True;Encrypt=False;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Collection_Item>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Collecti__3214EC07C137886B");

            entity.Property(e => e.Code).HasMaxLength(100);
            entity.Property(e => e.Label).HasMaxLength(100);

            entity.HasOne(d => d.Collection).WithMany(p => p.Collection_Items)
                .HasForeignKey(d => d.Collection_Id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CollectionItems_CollectionTypes");
        });

        modelBuilder.Entity<Collections_Type>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Collecti__3214EC07564559F0");

            entity.ToTable("Collections_Type");

            entity.Property(e => e.Code).HasMaxLength(100);
            entity.Property(e => e.Label).HasMaxLength(100);
        });

        modelBuilder.Entity<DB_File>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__DB_Files__3214EC273C17F684");

            entity.Property(e => e.DateCreation)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Nom).HasMaxLength(255);
            entity.Property(e => e.TypeMime).HasMaxLength(100);
        });

        modelBuilder.Entity<Entreprise>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__Entrepri__3214EC274923AD7A");

            entity.ToTable("Entreprise");

            entity.HasIndex(e => e.Phone, "UQ__Entrepri__5C7E359EEEFD664A").IsUnique();

            entity.HasIndex(e => e.Name, "UQ__Entrepri__737584F61A02B6F0").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Entrepri__A9D10534D4918FF3").IsUnique();

            entity.Property(e => e.ID).HasMaxLength(50);
            entity.Property(e => e.Adresse).HasMaxLength(255);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(25);
            entity.Property(e => e.Postal).HasMaxLength(255);
            entity.Property(e => e.Siret).HasMaxLength(100);
            entity.Property(e => e.Web).HasMaxLength(255);

            entity.HasOne(d => d.DomicilationNavigation).WithMany(p => p.EntrepriseDomicilationNavigations)
                .HasForeignKey(d => d.Domicilation)
                .HasConstraintName("FK__Entrepris__Domic__07C12930");

            entity.HasOne(d => d.ImgNavigation).WithMany(p => p.EntrepriseImgNavigations)
                .HasForeignKey(d => d.Img)
                .HasConstraintName("FK__Entreprise__Img__06CD04F7");

            entity.HasOne(d => d.Responsable).WithMany(p => p.Entreprises)
                .HasForeignKey(d => d.ResponsableID)
                .HasConstraintName("FK__Entrepris__Respo__05D8E0BE");

            entity.HasOne(d => d.Status).WithMany(p => p.Entreprises)
                .HasForeignKey(d => d.StatusID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Entrepris__Statu__2B0A656D");

            entity.HasMany(d => d.CollectionItems).WithMany(p => p.Entreprises)
                .UsingEntity<Dictionary<string, object>>(
                    "EntrepriseSecteur",
                    r => r.HasOne<Collection_Item>().WithMany()
                        .HasForeignKey("CollectionItemId")
                        .HasConstraintName("FK__Entrepris__Colle__123EB7A3"),
                    l => l.HasOne<Entreprise>().WithMany()
                        .HasForeignKey("EntrepriseId")
                        .HasConstraintName("FK__Entrepris__Entre__114A936A"),
                    j =>
                    {
                        j.HasKey("EntrepriseId", "CollectionItemId").HasName("PK__Entrepri__6C96601E9F9FAE5A");
                        j.ToTable("EntrepriseSecteurs");
                        j.IndexerProperty<string>("EntrepriseId").HasMaxLength(50);
                    });
        });

        modelBuilder.Entity<Horaire>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__Horaire__3214EC272EC607A5");

            entity.ToTable("Horaire");

            entity.Property(e => e.FRIDAY).HasMaxLength(255);
            entity.Property(e => e.MONDAY).HasMaxLength(255);
            entity.Property(e => e.SANDAY).HasMaxLength(255);
            entity.Property(e => e.SATURDAY).HasMaxLength(255);
            entity.Property(e => e.THURSDAY).HasMaxLength(255);
            entity.Property(e => e.TUESDAY).HasMaxLength(255);
            entity.Property(e => e.WEDNESDAY).HasMaxLength(255);
        });

        modelBuilder.Entity<Livreur>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__Livreur__3214EC271BEBE6F2");

            entity.ToTable("Livreur");

            entity.HasIndex(e => e.Phone, "UQ__Livreur__5C7E359ECEEB6C47").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Livreur__A9D10534D0B45ED6").IsUnique();

            entity.Property(e => e.ID).HasMaxLength(50);
            entity.Property(e => e.Adresse).HasMaxLength(255);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.Country)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Lastname).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(25);
            entity.Property(e => e.Postal).HasMaxLength(255);
            entity.Property(e => e.RIB).HasMaxLength(250);

            entity.HasOne(d => d.HoraireNavigation).WithMany(p => p.Livreurs)
                .HasForeignKey(d => d.Horaire)
                .HasConstraintName("FK__Livreur__Horaire__19DFD96B");

            entity.HasOne(d => d.ImgNavigation).WithMany(p => p.Livreurs)
                .HasForeignKey(d => d.Img)
                .HasConstraintName("FK__Livreur__Img__3A4CA8FD");

            entity.HasOne(d => d.Status).WithMany(p => p.Livreurs)
                .HasForeignKey(d => d.StatusID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Livreur__StatusI__2BFE89A6");

            entity.HasOne(d => d.VehicleNavigation).WithMany(p => p.Livreurs)
                .HasForeignKey(d => d.Vehicle)
                .HasConstraintName("FK__Livreur__Vehicle__18EBB532");

            entity.HasMany(d => d.CollectionItems).WithMany(p => p.Livreurs)
                .UsingEntity<Dictionary<string, object>>(
                    "LivreursLangue",
                    r => r.HasOne<Collection_Item>().WithMany()
                        .HasForeignKey("CollectionItemId")
                        .HasConstraintName("FK__LivreursL__Colle__1DB06A4F"),
                    l => l.HasOne<Livreur>().WithMany()
                        .HasForeignKey("LivreurId")
                        .HasConstraintName("FK__LivreursL__Livre__1CBC4616"),
                    j =>
                    {
                        j.HasKey("LivreurId", "CollectionItemId").HasName("PK__Livreurs__ECB797ECDDECF74E");
                        j.ToTable("LivreursLangues");
                        j.IndexerProperty<string>("LivreurId").HasMaxLength(50);
                    });
        });

        modelBuilder.Entity<Responsable>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__Responsa__3214EC279C28445B");

            entity.ToTable("Responsable");

            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Lastname).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(100);
        });

        modelBuilder.Entity<UserStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UserStat__3214EC074220D2E3");

            entity.ToTable("UserStatus");

            entity.HasIndex(e => e.Code, "UQ__UserStat__A25C5AA75A722F6A").IsUnique();

            entity.HasIndex(e => e.Label, "UQ__UserStat__EDBE0C58C4D8213B").IsUnique();

            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Label)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Severity).HasMaxLength(25);
        });

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__Vehicle__3214EC2708E3046B");

            entity.ToTable("Vehicle");

            entity.HasIndex(e => e.Matricule, "UQ__Vehicle__0FB9FB43F00052C3").IsUnique();

            entity.Property(e => e.Matricule).HasMaxLength(255);
            entity.Property(e => e.Model).HasMaxLength(255);

            entity.HasOne(d => d.AssuranceNavigation).WithMany(p => p.VehicleAssuranceNavigations)
                .HasForeignKey(d => d.Assurance)
                .HasConstraintName("FK__Vehicle__Assuran__571DF1D5");

            entity.HasOne(d => d.ImgNavigation).WithMany(p => p.VehicleImgNavigations)
                .HasForeignKey(d => d.Img)
                .HasConstraintName("FK__Vehicle__Img__5535A963");

            entity.HasOne(d => d.PermisNavigation).WithMany(p => p.VehiclePermisNavigations)
                .HasForeignKey(d => d.Permis)
                .HasConstraintName("FK__Vehicle__Permis__5629CD9C");

            entity.HasOne(d => d.TypeNavigation).WithMany(p => p.Vehicles)
                .HasForeignKey(d => d.Type)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vehicle__Type__5441852A");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
