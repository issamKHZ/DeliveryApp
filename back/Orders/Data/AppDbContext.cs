using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Orders.Models;

namespace Orders.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cities_Country> Cities_Countries { get; set; }

    public virtual DbSet<Collection_Item> Collection_Items { get; set; }

    public virtual DbSet<Collections_Type> Collections_Types { get; set; }

    public virtual DbSet<Entrep_Site> Entrep_Sites { get; set; }

    public virtual DbSet<Livreur_Schedule> Livreur_Schedules { get; set; }

    public virtual DbSet<Livreur_Task> Livreur_Tasks { get; set; }

//     protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
// #warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//         => optionsBuilder.UseSqlServer("Server=ISSAM20\\SQLEXPRESS;Database=DeliveryDB_ORDERS;User Id=sa;Password=Aqwxsz@1234;TrustServerCertificate=True;Encrypt=False;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cities_Country>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__Cities_C__3214EC27A3D7C9BE");

            entity.HasIndex(e => e.City, "UQ__Cities_C__AEC4A06DC9B7F8B0").IsUnique();

            entity.Property(e => e.City).HasMaxLength(255);
            entity.Property(e => e.Country).HasMaxLength(255);
        });

        modelBuilder.Entity<Collection_Item>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Collecti__3214EC07CFE51A25");

            entity.Property(e => e.Code).HasMaxLength(100);
            entity.Property(e => e.Label).HasMaxLength(255);

            entity.HasOne(d => d.Collection).WithMany(p => p.Collection_Items)
                .HasForeignKey(d => d.Collection_Id)
                .HasConstraintName("FK_CollectionItems_CollectionTypes");
        });

        modelBuilder.Entity<Collections_Type>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Collecti__3214EC073A26AC2D");

            entity.ToTable("Collections_Type");

            entity.Property(e => e.Code).HasMaxLength(100);
            entity.Property(e => e.Label).HasMaxLength(255);
        });

        modelBuilder.Entity<Entrep_Site>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__Entrep_S__3214EC275A9E41BF");

            entity.HasIndex(e => e.Phone, "UQ__Entrep_S__5C7E359E0CC1B04A").IsUnique();

            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.EntrepriseID).HasMaxLength(25);
            entity.Property(e => e.Phone).HasMaxLength(255);

            entity.HasOne(d => d.City).WithMany(p => p.Entrep_Sites)
                .HasForeignKey(d => d.CityID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Entrep_Si__CityI__4222D4EF");

            entity.HasOne(d => d.Disponibility).WithMany(p => p.Entrep_SiteDisponibilities)
                .HasForeignKey(d => d.DisponibilityID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Entrep_Si__Dispo__412EB0B6");

            entity.HasOne(d => d.Type).WithMany(p => p.Entrep_SiteTypes)
                .HasForeignKey(d => d.TypeID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Entrep_Si__TypeI__403A8C7D");
        });

        modelBuilder.Entity<Livreur_Schedule>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__Livreur___3214EC27A4BAD39B");

            entity.ToTable("Livreur_Schedule");

            entity.Property(e => e.LivreurID).HasMaxLength(25);
        });

        modelBuilder.Entity<Livreur_Task>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__Livreur___3214EC27515DD1C7");

            entity.ToTable("Livreur_Task");

            entity.Property(e => e.Title).HasMaxLength(250);

            entity.HasOne(d => d.Day).WithMany(p => p.Livreur_Tasks)
                .HasForeignKey(d => d.DayID)
                .HasConstraintName("FK__Livreur_T__DayID__4CA06362");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
