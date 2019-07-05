class AmmoCylinder extends Ammo.btRigidBody
{
    constructor(radius, height, mass, transform)
    {
        var shape = new Ammo.btCylindershape((new Vector3(radius, height / 2.0, radius)).toAmmoVector());
        var ammoTransform = new Ammo.btTransform();
        ammoTransform.setFromOpenGLMatrix(transform);
        var inertia = Vector3.zero.toAmmoVector();
        shape.calculateLocalInertia(mass, inertia);
        var motionState = new Ammo.btDefaultMotionState(ammoTransform);
        super(new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, inertia));
    }
}

class AmmoCylinderX extends Ammo.btRigidBody
{
    constructor(radius, height, mass, transform)
    {
        var shape = new Ammo.btCylinderShapeX((new Vector3(height / 2.0, radius, radius)).toAmmoVector());
        var ammoTransform = new Ammo.btTransform();
        ammoTransform.setFromOpenGLMatrix(transform);
        var inertia = Vector3.zero.toAmmoVector();
        shape.calculateLocalInertia(mass, inertia);
        var motionState = new Ammo.btDefaultMotionState(ammoTransform);
        super(new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, inertia));
    }
}

class AmmoCylinderZ extends Ammo.btRigidBody
{
    constructor(radius, height, mass, transform)
    {
        var shape = new Ammo.btCylinderShapeZ((new Vector3(radius, radius, height / 2.0)).toAmmoVector());
        var ammoTransform = new Ammo.btTransform();
        ammoTransform.setFromOpenGLMatrix(transform);
        var inertia = Vector3.zero.toAmmoVector();
        shape.calculateLocalInertia(mass, inertia);
        var motionState = new Ammo.btDefaultMotionState(ammoTransform);
        super(new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, inertia));
    }
}
