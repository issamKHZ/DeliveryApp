using System;
using System.Collections.Generic;
using Authentication.Models;
using Microsoft.EntityFrameworkCore;

namespace Authentication.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Entreprise> Entreprises { get; set; }

    public virtual DbSet<Livreur> Livreurs { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserStatus> UserStatuses { get; set; }

    public virtual DbSet<UserTokensValidation> UserTokensValidations { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=ISSAM20\\SQLEXPRESS;Database=DeliveryDB;User Id=sa;Password=Aqwxsz@1234;TrustServerCertificate=True;Encrypt=False;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Entreprise>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Entrepri__3214EC0781FF1DE9");

            entity.ToTable("Entreprise");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.ActivitySector)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Address)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.City)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Country)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.PostalCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.RIB)
                .HasMaxLength(34)
                .IsUnicode(false);
            entity.Property(e => e.ResponsibleName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.SiretNumber)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.IdNavigation).WithOne(p => p.Entreprise)
                .HasForeignKey<Entreprise>(d => d.Id)
                .HasConstraintName("FK__Entreprise__Id__628FA481");
        });

        modelBuilder.Entity<Livreur>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Livreur__3214EC07FBC6F098");

            entity.ToTable("Livreur");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Address)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.City)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Country)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.FirstName)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.RIB)
                .HasMaxLength(34)
                .IsUnicode(false);
            entity.Property(e => e.VehicleType)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.IdNavigation).WithOne(p => p.Livreur)
                .HasForeignKey<Livreur>(d => d.Id)
                .HasConstraintName("FK__Livreur__Id__02FC7413");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Role__3214EC074E0A8325");

            entity.ToTable("Role");

            entity.HasIndex(e => e.Code, "UQ__Role__A25C5AA7DC1291B9").IsUnique();

            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Description)
                .HasMaxLength(200)
                .IsUnicode(false);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__User__3214EC07BF0FE7EF");

            entity.ToTable("User");

            entity.HasIndex(e => e.AccountId, "UQ__User__349DA5A7C65EFFB2").IsUnique();

            entity.HasIndex(e => e.PhoneNumber, "UQ__User__85FB4E3838BD6F25").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__User__A9D10534F9CA3911").IsUnique();

            entity.Property(e => e.AccountId)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.PasswordHash).IsUnicode(false);
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(25)
                .IsUnicode(false);

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__User__RoleId__4BAC3F29");

            entity.HasOne(d => d.Status).WithMany(p => p.Users)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__User__StatusId__4AB81AF0");
        });

        modelBuilder.Entity<UserStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UserStat__3214EC07A323810A");

            entity.ToTable("UserStatus");

            entity.HasIndex(e => e.Code, "UQ__UserStat__A25C5AA701B8ECBB").IsUnique();

            entity.HasIndex(e => e.Label, "UQ__UserStat__EDBE0C58A9D9E556").IsUnique();

            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Label)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<UserTokensValidation>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__UserToke__1788CC4C9B403739");

            entity.ToTable("UserTokensValidation");

            entity.Property(e => e.UserId).ValueGeneratedNever();
            entity.Property(e => e.EmailTokenExpiration).HasColumnType("datetime");
            entity.Property(e => e.EmailValidationToken).HasMaxLength(255);
            entity.Property(e => e.PasswordResetToken).HasMaxLength(255);
            entity.Property(e => e.PasswordTokenExpiration).HasColumnType("datetime");

            entity.HasOne(d => d.User).WithOne(p => p.UserTokensValidation)
                .HasForeignKey<UserTokensValidation>(d => d.UserId)
                .HasConstraintName("FK_UserTokens_User");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
